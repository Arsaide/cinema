import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { PrismaService } from '../prisma.service';
import { StreamService } from './stream.service';

@Module({
    controllers: [MovieController],
    providers: [MovieService, PrismaService, StreamService],
})
export class MovieModule {}
