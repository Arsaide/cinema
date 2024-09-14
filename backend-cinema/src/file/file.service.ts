import { Injectable } from '@nestjs/common';
import { FileResponse } from './file.interface';
import { path } from 'app-root-path';
import { ensureDir, unlink, writeFile } from 'fs-extra';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';
import * as sharp from 'sharp';
import * as ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class FileService {
    async saveFiles(
        files: Express.Multer.File[],
        folder: string = 'default',
    ): Promise<FileResponse[]> {
        const uploadFolder = `${path}/uploads/${folder}`;

        await ensureDir(uploadFolder);

        const res: FileResponse[] = await Promise.all(
            files.map(async file => {
                const uniqueFileName = `${dayjs().format('DD-MM-YYYY')}-${crypto.randomBytes(4).toString('hex')}-${file.originalname}`;
                const fileExtension = file.originalname.split('.').pop();
                const baseFileName = uniqueFileName.replace(/\.[^/.]+$/, '');
                let fileName = `${baseFileName}.${fileExtension}`;
                let filePath = `${uploadFolder}/${fileName}`;

                if (file.mimetype.startsWith('image/')) {
                    fileName = `${fileName}.webp`;
                    filePath = `${uploadFolder}/${fileName}`;

                    await sharp(file.buffer).webp({ quality: 90 }).toFile(filePath);

                    return {
                        url: `/uploads/images/${folder}/${fileName}`,
                        name: fileName,
                        type: 'image',
                    };
                }

                if (file.mimetype.startsWith('video/')) {
                    const videoUrls = [];

                    await writeFile(filePath, file.buffer);

                    const originalResolution = await this.getVideoResolution(filePath);

                    const availableResolution = [480, 720, 1080, 1280, 1440];
                    const resolutionToConvert = availableResolution.filter(
                        res => res <= originalResolution.width,
                    );

                    await Promise.all(
                        resolutionToConvert.map(async resolution => {
                            const outputFileName = `${resolution}p_${baseFileName}.mp4`;
                            const outputFilePath = `${uploadFolder}/${outputFileName}`;

                            await new Promise((resolve, reject) => {
                                ffmpeg(filePath)
                                    .size(`${resolution}x?`)
                                    .output(outputFilePath)
                                    .on('end', resolve)
                                    .on('error', reject)
                                    .run();
                            });

                            videoUrls.push({
                                url: `/uploads/${folder}/${outputFileName}`,
                                name: outputFileName,
                                quality: `${resolution}p`,
                            });
                        }),
                    );

                    videoUrls.push({
                        url: `/uploads/${folder}/${fileName}`,
                        name: fileName,
                        quality: `${originalResolution.width}p`,
                    });

                    try {
                        await unlink(filePath);
                    } catch (error) {
                        console.error('Error deleting original video file:', error);
                    }

                    return {
                        videoUrls: videoUrls,
                        type: 'video',
                    };
                }
                await writeFile(filePath, file.buffer);

                return {
                    url: `/uploads/files/${folder}/${fileName}`,
                    name: fileName,
                };
            }),
        );

        return res;
    }

    // Разрешение видео
    private async getVideoResolution(filePath: string): Promise<{ width: number; height: number }> {
        return new Promise(async (resolve, reject) => {
            ffmpeg.ffprobe(filePath, (error, metadata) => {
                if (error) {
                    reject(error);
                } else {
                    const { width, height } = metadata.streams[0];
                    resolve({ width, height });
                }
            });
        });
    }
}
