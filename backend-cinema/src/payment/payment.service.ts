import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentDto } from './dto/payment.dto';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma.service';
import * as paypal from '@paypal/checkout-server-sdk';
import { PaymentStatus } from '@prisma/client';
import { returnPaymentObject } from './return-payment.object';

@Injectable()
export class PaymentService {
    private paypalClient: paypal.core.PayPalHttpClient;

    constructor(
        private readonly configService: ConfigService,
        private userService: UserService,
        private prisma: PrismaService,
    ) {
        const env = new paypal.core.SandboxEnvironment(
            this.configService.get<string>('PAYPAL_CLIENT_ID'),
            this.configService.get<string>('PAYPAL_SECRET'),
        );
        this.paypalClient = new paypal.core.PayPalHttpClient(env);
    }

    async checkout(dto: PaymentDto, userId: string) {
        const user = await this.userService.getById(userId);

        if (user.isHasPremium) {
            throw new ConflictException('The user still has an active premium subscription!');
        }

        const order = await this.prisma.payment.create({
            data: {
                status: dto.status,
                amount: dto.amount,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });

        const request = new paypal.orders.OrdersCreateRequest();
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: dto.amount.toFixed(2),
                    },
                    description: `Arsaide cinema, Premium Subscription. User ID - ${userId}`,
                    custom_id: order.id,
                },
            ],
            application_context: {
                return_url: this.configService.get<string>('PAYPAL_SUCCESS_URL'),
                cancel_url: this.configService.get<string>('PAYPAL_CANCEL_URL'),
            },
        });

        const createOrderResponse = await this.paypalClient.execute(request);

        const approvalUrl = createOrderResponse.result.links.find(
            (link: { rel: string }) => link.rel === 'approve',
        )?.href;

        await this.prisma.payment.update({
            where: { id: order.id },
            data: { status: 'PENDING', paymentUrl: approvalUrl },
        });

        return { paymentUrl: approvalUrl };
    }

    async paymentSuccess(token: string) {
        const orderDetails = await this.getOrderDetails(token);
        const customId = orderDetails.purchase_units[0]?.custom_id;
        const payment = await this.getPaymentById(customId);
        const userId = payment.userId;
        const user = await this.userService.getById(userId);

        if (user.isHasPremium) {
            throw new ConflictException('The user still has an active premium subscription!');
        }

        if (!customId) {
            throw new HttpException(
                'Custom ID not found in PayPal response',
                HttpStatus.BAD_REQUEST,
            );
        }

        await this.updatePaymentStatus(customId, PaymentStatus.PAYED);

        await this.updateUserPremiumStatus(userId, true);

        return {
            message: 'Payment successful! Your account now has Premium status!',
            ...orderDetails,
        };
    }

    async updateUserPremiumStatus(userId: string, hasPremium: boolean) {
        await this.userService.updatePremiumStatus(userId, hasPremium);
    }

    async getOrderDetails(orderId: string) {
        const request = new paypal.orders.OrdersGetRequest(orderId);
        const response = await this.paypalClient.execute(request);
        return response.result;
    }

    async getPaymentById(paymentId: string) {
        return this.prisma.payment.findUnique({
            where: { id: paymentId },
        });
    }

    async updatePaymentStatus(orderId: string, status: PaymentStatus) {
        await this.prisma.payment.update({
            where: { id: orderId },
            data: { status },
        });
    }

    /* ADMIN REQUESTS */

    async getAll() {
        return this.prisma.payment.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            select: returnPaymentObject,
        });
    }

    async cancelPayment(id: string) {
        const payment = await this.getPaymentById(id);
        const userId = payment.userId;
        await this.userService.updatePremiumStatus(userId, false);

        return this.prisma.payment.update({
            where: { id },
            data: { status: 'PENDING' },
        });
    }

    async delete(id: string) {
        const payment = await this.getPaymentById(id);
        const userId = payment.userId;
        await this.userService.updatePremiumStatus(userId, false);

        return this.prisma.payment.delete({
            where: {
                id,
            },
        });
    }
}
