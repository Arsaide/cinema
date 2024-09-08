import { Injectable } from '@nestjs/common';
import { FileResponse } from './file.interface';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';

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

                await writeFile(`${uploadFolder}/${uniqueFileName}`, file.buffer);

                return {
                    url: `/uploads/${folder}/${uniqueFileName}`,
                    name: uniqueFileName,
                };
            }),
        );

        return res;
    }
}
