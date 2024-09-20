import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot(), HttpModule],
    controllers: [PaymentController],
    providers: [PaymentService, PrismaService, UserService],
})
export class PaymentModule {}
