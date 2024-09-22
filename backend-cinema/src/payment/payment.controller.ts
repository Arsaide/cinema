import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDto } from './dto/payment.dto';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post()
    @Auth()
    checkout(@Body() dto: PaymentDto, @Body('userId') userId: string) {
        return this.paymentService.checkout(dto, userId);
    }

    @Get('success')
    async paymentSuccess(@Query('token') token: string) {
        return await this.paymentService.paymentSuccess(token);
    }

    @Get('cancel')
    @Auth()
    async paymentCancel() {
        return { message: 'Payment cancelled' };
    }

    @HttpCode(200)
    @Get()
    @Auth('admin')
    async getAll() {
        return this.paymentService.getAll();
    }

    @Delete(':id')
    @Auth('admin')
    async delete(@Param('id') id: string) {
        return this.paymentService.delete(id);
    }

    @Post('/cancel/:id')
    @Auth('admin')
    async cancel(@Param('id') id: string) {
        return this.paymentService.cancelPayment(id);
    }
}
