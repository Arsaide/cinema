import { Module } from '@nestjs/common';
import { ActorService } from './actor.service';
import { ActorController } from './actor.controller';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [ActorController],
    providers: [ActorService, PrismaService],
})
export class ActorModule {}
