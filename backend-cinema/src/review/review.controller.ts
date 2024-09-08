import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../user/decorators/user.decorator';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @UsePipes(new ValidationPipe())
    @Post('leave/:movieId')
    @HttpCode(200)
    @Auth()
    async create(
        @CurrentUser('id') usedId: string,
        @Param('movieId') movieId: string,
        @Body() dto: CreateReviewDto,
    ) {
        return this.reviewService.create(usedId, movieId, dto);
    }

    /* Admin request */
    @Get()
    @Auth('admin')
    async getAll() {
        return this.reviewService.getAll();
    }

    @Delete(':id')
    @Auth('admin')
    async delete(@Param('id') id: string) {
        const deletedReview = await this.reviewService.delete(id);

        if (!deletedReview) throw new NotFoundException('Review not found');

        return deletedReview;
    }
}
