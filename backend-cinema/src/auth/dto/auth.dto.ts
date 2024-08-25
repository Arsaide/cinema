import { IsOptional, IsString, MinLength } from 'class-validator';

export class AuthDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsString()
    email: string;

    @MinLength(6, {
        message: 'Password must be at least 6 characters',
    })
    @IsString()
    password: string;
}
