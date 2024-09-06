import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Genre } from '@prisma/client';

export const CurrentGenre = createParamDecorator((data: keyof Genre, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const genre = request.genre;

    return data ? genre[data] : genre;
});
