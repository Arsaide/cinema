import { IsString } from 'class-validator';

export class RefreshTokenDto {
    @IsString({
        message: "You didn't pass the refresh-token or the token isn't a string!",
    })
    refreshToken: string;
}
