import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from "nodemailer"
import { NotifyEmailDto } from './dtos/notify-email.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService){}

  private readonly transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
      type: "OAuth2",
      user: this.configService.get("SMTP_USER"),
      clientId: this.configService.get("GOOGLE_AUTH_CLIENT_ID"),
      clientSecret: this.configService.get("GOOGLE_AUTH_CLIENT_SECRET"),
      refreshToken: this.configService.get("GOOGLE_AUTH_REFRESH_TOKEN")
    }
  })

 

  async notifyEmail({ email, text }: NotifyEmailDto) {
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject: 'Sleepr Notification',
      text,
    });
  }
}
