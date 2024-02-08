import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule, LoggerModule, RequestUserMiddleware } from '@app/common';
import { ReservationsRepository } from './reservations.repository';
import {
  ReservationDocument,
  ReservationSchema,
} from './models/reservation.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE, PAYMENTS_SERVICE } from '@app/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'apps/auth/src/strategies/jwt.strategy';
import { UsersModule } from 'apps/auth/src/users/users.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ReservationDocument.name, schema: ReservationSchema },
    ]),
   LoggerModule,
   ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      MONGODB_URI: Joi.string().required(),
      PORT: Joi.number().required(),
      PAYMENTS_HOST: Joi.string().required(),
      AUTH_HOST: Joi.string().required(),
      PAYMENTS_PORT: Joi.number().required(),
      AUTH_PORT: Joi.number().required(),
    })
   }),

   JwtModule.registerAsync({
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: `${configService.get<number>('JWT_EXPIRATION')}s`,
      },
    }),
    inject: [ConfigService],
  }),
  ClientsModule.registerAsync([
    {
      name: AUTH_SERVICE,
      useFactory: (configService: ConfigService) => ({
        transport: Transport.TCP,
        options: {
          host: configService.get('AUTH_HOST'),
          port: configService.get('AUTH_PORT'),
        },
      }),
      inject: [ConfigService],
    },
    {
      name: PAYMENTS_SERVICE,
      useFactory: (configService: ConfigService) => ({
        transport: Transport.TCP,
        options: {
          host: configService.get('PAYMENTS_HOST'),
          port: configService.get('PAYMENTS_PORT'),
        },
      }),
      inject: [ConfigService],
    },
  ]),

  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository, JwtStrategy],
})
export class ReservationsModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(RequestUserMiddleware).forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
    }
}
