import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('profile')
    @Auth()
    async getProfile(@CurrentUser('id') id: string) {
        return this.userService.getById(id);
    }

    @Post('profile/favorites')
    @HttpCode(200)
    @Auth()
    async toggleFavorite(@Body('movieId') movieId: string, @CurrentUser('id') userId: string) {
        return this.userService.toggleFavorite(movieId, userId);
    }

    // Admin Request

    @Get()
    @Auth('admin')
    async getAll(@Query('searchTerm') searchTerm?: string) {
        return this.userService.getAll(searchTerm);
    }

    @Get('by-id/:id')
    @Auth('admin')
    async getById(@Param('id') id: string) {
        return this.userService.getById(id);
    }

    @UsePipes(new ValidationPipe())
    @Put(':id')
    @HttpCode(200)
    @Auth()
    async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        const updatedUser = await this.userService.update(id, dto);

        if (!updatedUser) throw new NotFoundException('User not found');

        return updatedUser;
    }

    @Delete(':id')
    @Auth()
    async delete(@Param('id') id: string) {
        const deleteUser = await this.userService.delete(id);

        if (!deleteUser) throw new NotFoundException('User not found');

        return deleteUser;
    }
}
