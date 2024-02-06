import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
  }

  async findOne(email: string, stopBreak?: boolean) {
    return await this.usersRepository.findOne({email}, stopBreak)
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({email});
    const passwordValid = await bcrypt.compare(password, user.password)

    if(!passwordValid){
      throw new UnauthorizedException("Invalid credentials")
    }
    return user
  }
}
