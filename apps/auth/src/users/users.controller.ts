import { Body, Controller, Get, Post } from '@nestjs/common';
import { SecureEndpoint } from '../decorators/secure-endpoint.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@SecureEndpoint()
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Get("me")
    async fetchUser(){
        return "user details"
    }

}
