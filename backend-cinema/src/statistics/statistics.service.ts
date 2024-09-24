import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as dayjs from 'dayjs';

@Injectable()
export class StatisticsService {
    constructor(private prisma: PrismaService) {}

    async getMainStatistics() {
        const countUsers = await this.prisma.user.count();
        const countMovies = await this.prisma.movie.count();

        const countViews = await this.prisma.movie.aggregate({
            _sum: {
                views: true,
            },
        });

        const averageRating = await this.prisma.review.aggregate({
            _avg: {
                rating: true,
            },
        });

        return [
            { id: 1, name: 'Views', value: countViews._sum.views },
            { id: 2, name: 'Movies', value: countMovies },
            { id: 3, name: 'Users', value: countUsers },
            {
                id: 4,
                name: 'Average rating',
                value: averageRating._avg.rating || 0,
            },
        ];
    }

    async getMiddleStatistics() {
        const movies = await this.prisma.movie.findMany({
            select: {
                title: true,
                views: true,
            },
        });

        const topMovies = movies.sort((a, b) => b.views - a.views).slice(0, 4);

        const startDate = dayjs().subtract(14, 'days').startOf('day').toDate();
        const endDate = dayjs().endOf('day').toDate();

        const salesRew = await this.prisma.payment.groupBy({
            by: ['createdAt'],
            _sum: {
                amount: true,
            },
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];

        const formatDate = (date: Date): string => {
            return `${date.getDate()} ${monthNames[date.getMonth()]}`;
        };

        const salesByDate: { [key: string]: number } = {};

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const formattedDate = formatDate(new Date(d));
            salesByDate[formattedDate] = 0;
        }

        for (const sale of salesRew) {
            const formattedDate = formatDate(new Date(sale.createdAt));
            if (salesByDate[formattedDate] !== undefined) {
                salesByDate[formattedDate] += sale._sum.amount;
            }
        }

        const salesByWeek = Object.keys(salesByDate).map(date => ({
            date,
            total: salesByDate[date],
        }));

        return {
            topMovies: topMovies.map(movie => ({
                title: movie.title,
                views: movie.views,
            })),
            salesByWeek,
        };
    }
}
