import {
    Body,
    Controller,
    Delete,
    Get,
    Header,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Res,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Response } from 'express';
import { StreamService } from './stream.service';

@Controller('movies')
export class MovieController {
    constructor(
        private readonly movieService: MovieService,
        private readonly streamService: StreamService,
    ) {}

    @Get()
    async getAll(@Query('searchTerm') searchTerm?: string) {
        return this.movieService.getAll(searchTerm);
    }

    @Get('stream/:id')
    @Header('Content-Type', 'video/mp4')
    async streamVideo(
        @Param('id') id: string,
        @Res() res: Response,
        @Query('quality') quality: string,
    ) {
        const range = res.req.headers.range;

        return this.streamService.streamVideo(id, range, res, quality);
    }

    @Get('most-popular')
    @HttpCode(200)
    async getMostPopular() {
        return this.movieService.getMostPopular();
    }

    @Get('by-slug/:slug')
    @HttpCode(200)
    async getBySlug(@Param('slug') slug: string) {
        return this.movieService.getBySlug(slug);
    }

    @Get('by-actor/:id')
    @HttpCode(200)
    async getByActors(@Param('actorId') actorId: string) {
        return this.movieService.getByActor(actorId);
    }

    @Post('by-genres')
    @HttpCode(200)
    async getByGenres(
        @Body('genreIds')
        genreIds: string[],
    ) {
        return this.movieService.getByGenres(genreIds);
    }

    @Put('update-count-views')
    async updateCountViews(@Body('slug') slug: string) {
        return this.movieService.updateCountViews(slug);
    }

    /* Admin requests */

    @Post()
    @HttpCode(200)
    @Auth('admin')
    async create() {
        return this.movieService.create();
    }

    @Get('by-id/:id')
    @HttpCode(200)
    @Auth('admin')
    async getById(@Param('id') id: string) {
        return this.movieService.getById(id);
    }

    @UsePipes(new ValidationPipe())
    @Put(':id')
    @HttpCode(200)
    @Auth('admin')
    async update(@Param('id') id: string, @Body() data: UpdateMovieDto) {
        const updatedMovie = this.movieService.update(id, data);

        if (!updatedMovie) throw new NotFoundException('Movie not found');

        return updatedMovie;
    }

    @Delete(':id')
    @Auth('admin')
    async delete(@Param('id') id: string) {
        const deletedMovie = this.movieService.delete(id);

        if (!deletedMovie) throw new NotFoundException('Movie not found');

        return deletedMovie;
    }
}
