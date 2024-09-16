import { IsArray, IsNumber, IsString } from 'class-validator';

export class UpdateMovieDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    poster: string;

    @IsString()
    bigPoster: string;

    @IsArray()
    @IsString({ each: true })
    videoUrls: string[];

    @IsString()
    country: string;

    @IsNumber()
    year: number;

    @IsNumber()
    duration: number;

    @IsArray()
    @IsString({ each: true })
    genres: string[];

    @IsArray()
    @IsString({ each: true })
    actors: string[];
}
