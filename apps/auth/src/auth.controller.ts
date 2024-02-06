import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from './users/dtos/create-user.dto';
import { UsersDocument } from './users/models/users.schema';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signup(@Body() payload: CreateUserDto) {
    return await this.authService.signup(payload)
  }

  @Post("login")
  async login(@Body() payload: CreateUserDto) {
    return await this.authService.login(payload)
  }
}
