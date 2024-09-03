import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';

interface TempUser {
    dto: AuthDto;
    expires: Date;
}

@Injectable()
export class AuthService {
    private tempUsers = new Map<string, TempUser>();

    constructor(
        private prisma: PrismaService,
        private userService: UserService,
        private mailService: MailService,
        private configService: ConfigService,
    ) {}

    async register(dto: AuthDto) {
        const oldUser = await this.userService.getByEmail(dto.email);

        if (oldUser) throw new BadRequestException('User already exists');

        const token = crypto.randomBytes(32).toString('hex');
        const expires = dayjs().add(5, 'minute').toDate();

        this.tempUsers.set(token, { dto, expires });
        const confirmationUrl = `${this.configService.get('FRONTEND_LINK')}/auth/confirm?token=${token}`;

        await this.mailService.sendMail(
            dto.email,
            'Confirm your email',
            `<a href='${confirmationUrl}'>Click here to confirm your email</a>`,
        );

        return {
            message: 'Registration initiated, please check your mail-box to confirm your account',
            token,
        };
    }

    async confirmEmail(token: string) {
        const tempUser = this.tempUsers.get(token);

        if (!tempUser || dayjs(tempUser.expires).isBefore(dayjs())) {
            throw new BadRequestException('Token is invalid or has expired. Try again!');
        }

        const user = await this.userService.create(tempUser.dto);

        this.tempUsers.delete(token);

        return {
            message: 'Email confirmed successfully!',
            user,
        };
    }
}
