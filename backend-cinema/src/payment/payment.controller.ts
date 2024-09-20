import { Body, Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PrismaService } from '../prisma.service';
import { PaymentDto } from './dto/payment.dto';
import { PaymentStatus } from '@prisma/client';
import { UserService } from '../user/user.service';

@Controller('payments')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService,
        private readonly service: PrismaService,
        private readonly userService: UserService,
    ) {}

    @Post('checkout')
    async checkout(@Body() dto: PaymentDto, @Body('userId') userId: string) {
        return await this.paymentService.checkout(dto, userId);
    }

    @Get('success')
    async paymentSuccess(@Query('token') token: string) {
        try {
            const orderDetails = await this.paymentService.getOrderDetails(token);
            const customId = orderDetails.purchase_units[0]?.custom_id;

            if (!customId) {
                throw new HttpException(
                    'Custom ID not found in PayPal response',
                    HttpStatus.BAD_REQUEST,
                );
            }

            // const captureResult = await this.paymentService.capturePayment(orderDetails.id);

            await this.paymentService.updatePaymentStatus(customId, PaymentStatus.PAYED);

            const payment = await this.paymentService.getPaymentById(customId);
            const userId = payment.userId;

            await this.userService.updatePremiumStatus(userId, true);

            return { message: 'Payment successful' };
        } catch (error) {
            console.error(error);
            throw new HttpException('Payment capture failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('cancel')
    async paymentCancel() {
        return { message: 'Payment cancelled' };
    }
}
