import { Prisma } from '@prisma/client';
import { returnUserObject } from '../user/return-user.object';

export const returnReviewObject: Prisma.ReviewSelect = {
    id: true,
    createdAt: true,
    text: true,
    rating: true,
    user: {
        select: returnUserObject,
    },
    movie: {
        select: {
            id: true,
        },
    },
};
