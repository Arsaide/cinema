import { Injectable } from '@nestjs/common';
import { FileResponse } from './file.interface';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';
import * as sharp from 'sharp';

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
                } else {
                    await writeFile(filePath, file.buffer);
                }

                return {
                    url: `/uploads/${folder}/${fileName}`,
                    name: fileName,
                };
            }),
        );

        return res;
    }
}
