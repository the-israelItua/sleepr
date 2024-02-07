
import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
  import { Request } from 'express';
import { map, tap } from 'rxjs';
import { AUTH_SERVICE } from '../contants';
  
  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException();
      }
      
      this.authClient.send("authenticate", {
        Authentication: token
      }).pipe(
        tap(res => {
            console.log(res, "Inguard")
            context.switchToHttp().getRequest().user = res
        }),
        map(() => true)
      )
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }