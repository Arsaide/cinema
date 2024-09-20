import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { PaymentStatus } from '@prisma/client';

export class PaymentDto {
    @IsOptional()
    @IsEnum(PaymentStatus)
    status: PaymentStatus;

    @IsNumber()
    amount: number;
}
