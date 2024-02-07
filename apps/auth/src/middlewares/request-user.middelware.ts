/*
https://docs.nestjs.com/middleware#middleware
*/

import { Injectable, NestMiddleware, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';

@Injectable({ scope: Scope.REQUEST })
export class RequestUserMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private configService: ConfigService
  ) {}
  // eslint-disable-next-line @typescript-eslint/ban-types
  async use(req: Request, res: Response, next: Function) {
    if (this.jwtService) {
      if (req?.headers['authorization']) {
        const authorization = req.headers['authorization']?.substr(7); // Get bearer token

        if (authorization) {
          try {
            const userData = this.jwtService?.verify(authorization, {
              secret: this.configService.get("JWT_SECRET"),
            });
            // TODO: Implement caching here in the future
            const user = await this.userService.findOne(userData?.email);
            req['loggedInUser'] = user;
          } catch (error) {
            req['loggedInUser'] = null;
          }
        }
      }
      next();
    } else {
      next();
    }
  }
}
