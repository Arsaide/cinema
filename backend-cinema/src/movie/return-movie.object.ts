import { Prisma } from '@prisma/client';
import { returnReviewObject } from '../review/return-review.object';
import { returnActorObject } from '../actor/return-actor.object';
import { returnGenreObject } from '../genre/return-genre.object';

export const returnMovieObject: Prisma.MovieSelect = {
    id: true,
    createdAt: true,
    title: true,
    slug: true,
    description: true,
    poster: true,
    bigPoster: true,
    year: true,
    duration: true,
    country: true,
    views: true,
    videoUrls: true,
    reviews: {
        orderBy: {
            createdAt: 'desc',
        },
        select: returnReviewObject,
    },
    actors: {
        select: returnActorObject,
    },
    genres: {
        select: returnGenreObject,
    },
};
