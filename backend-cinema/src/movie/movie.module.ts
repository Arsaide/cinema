import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [MovieController],
    providers: [MovieService, PrismaService],
})
export class MovieModule {}
