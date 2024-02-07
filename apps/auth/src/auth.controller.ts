import { Body, Controller, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CreateUserDto } from './users/dtos/create-user.dto';

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

  @MessagePattern("authenticate")
  async authenticate() {
   
  } 
}
