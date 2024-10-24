import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';

interface TempUser {
    dto: AuthDto;
    expires: Date;
}

@Injectable()
export class AuthService {
    private tempUsers = new Map<string, TempUser>();

    constructor(
        private userService: UserService,
        private mailService: MailService,
        private configService: ConfigService,
        private jwt: JwtService,
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
            throw new BadRequestException(
                'User already exist or token is invalid or has expired. Try again',
            );
        }

        const user = await this.userService.create(tempUser.dto);

        const tokens = this.issueTokens(user.id);

        this.tempUsers.delete(token);

        return {
            message: 'Email confirmed successfully!',
            user: {
                name: user.name,
                email: user.email,
            },
            ...tokens,
        };
    }

    async login(dto: AuthDto) {
        const user = await this.validateUser(dto);
        const tokens = this.issueTokens(user.id);

        return { message: 'Login is success', user, ...tokens };
    }

    async getNewTokens(refreshToken: string) {
        const result = await this.jwt.verify(refreshToken);
        if (!result) throw new UnauthorizedException('Invalid refresh token!');

        const user = await this.userService.getById(result.id);

        const tokens = this.issueTokens(user.id);

        return {
            user,
            ...tokens,
        };
    }

    private issueTokens(userId: string) {
        const data = { id: userId };

        const accessToken = this.jwt.sign(data, {
            expiresIn: '1h',
        });

        const refreshToken = this.jwt.sign(data, {
            expiresIn: '7d',
        });

        return { accessToken, refreshToken };
    }

    private async validateUser(dto: AuthDto) {
        const user = await this.userService.getByEmail(dto.email);

        if (!user) throw new NotFoundException('User not found!');

        const isValidPassword = await verify(user.password, dto.password);

        if (!isValidPassword) throw new UnauthorizedException('Invalid password!');

        return user;
    }
}
