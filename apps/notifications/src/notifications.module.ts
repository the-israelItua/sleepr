import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { UsersModule } from 'apps/auth/src/users/users.module';
import { LoggerModule } from 'nestjs-pino';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    UsersModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.number().required(),
        PORT: Joi.number().required(),
        NOTIFICATIONS_PORT: Joi.string().required(),
        NOTIFICATIONS_HOST: Joi.number().required(),
        SMTP_USER: Joi.string().required(),
        GOOGLE_AUTH_CLIENT_ID: Joi.string().required(),
        GOOGLE_AUTH_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_AUTH_REFRESH_TOKEN: Joi.string().required()
      }),
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
