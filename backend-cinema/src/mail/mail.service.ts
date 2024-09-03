import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
    private transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: configService.get('EMAIL'),
                pass: configService.get('EMAIL_PASSWORD'),
            },
        });
    }

    async sendMail(to: string, subject: string, html: string) {
        await this.transporter.sendMail({
            from: `"Arsaide Cinema" ${this.configService.get('EMAIL')}`,
            to,
            subject,
            html,
        });
    }
}
