import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [GenreController],
    providers: [GenreService, PrismaService],
})
export class GenreModule {}
