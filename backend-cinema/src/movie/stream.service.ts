import { Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { createReadStream, statSync } from 'fs';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StreamService {
    constructor(private prisma: PrismaService) {}

    async streamVideo(id: string, range: string, res: Response) {
        const movie = await this.prisma.movie.findUnique({
            where: {
                id,
            },
        });

        if (!movie || !movie.videoUrl) {
            throw new NotFoundException('Video not found');
        }

        const videoPath = join(__dirname, '..', '..', movie.videoUrl);

        try {
            const stats = statSync(videoPath);
            const fileSize = stats.size;

            if (range) {
                const parts = range.replace(/bytes=/, '').split('-');
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

                if (start >= fileSize) {
                    res.status(416).send(
                        'Request range not satisfiable\n' + start + '>=' + fileSize,
                    );
                    return;
                }

                const chunkSize = end - start + 1;
                const file = createReadStream(videoPath, { start, end });

                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunkSize,
                    'Content-Type': 'video/mp4',
                };

                res.writeHead(206, head);
                file.pipe(res);
            } else {
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4',
                };

                res.writeHead(200, head);
                createReadStream(videoPath).pipe(res);
            }
        } catch (error) {
            throw new NotFoundException('Video not found');
        }
    }
}
