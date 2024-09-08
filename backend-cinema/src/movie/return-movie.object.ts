import { Prisma } from '@prisma/client';

export const returnMovieObject: Prisma.MovieSelect = {
    id: true,
    createdAt: true,
    title: true,
    slug: true,
    poster: true,
    bigPoster: true,
    year: true,
    duration: true,
    contry: true,
    views: true,
    videoUrl: true,
};
