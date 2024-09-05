import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email?: string;

    @IsOptional()
    @MinLength(6, {
        message: 'Password must be at least 6 characters',
    })
    @IsString()
    password: string;

    @IsEnum(UserRole)
    role: UserRole;
}
