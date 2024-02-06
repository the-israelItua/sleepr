import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from './users/dtos/create-user.dto';
import { UsersDocument } from './users/models/users.schema';
import { UsersService } from './users/users.service';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService, private readonly jwtService: JwtService, private readonly configService: ConfigService){}

  generateUserAccessToken(user: UsersDocument) {
    return this.jwtService.sign(instanceToPlain(user), { expiresIn: "2d", secret: this.configService.get('JWT_SECRET') });
  }

  async signup(body: CreateUserDto) {
    const user = await this.userService.findOne(body.email, true);

    if(user){
      throw new BadRequestException("User already exists")
    }

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(body.password, salt, 32)) as Buffer;

    const hashedPassword = salt + '.' + hash.toString('hex');

    const newUser = await this.userService.create({
     ...body,
      password: hashedPassword,
    });

   return {
        access_token: this.generateUserAccessToken(newUser),
      };
  }

  async login(body: CreateUserDto){
    const user = await this.userService.findOne(body.email);

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(body.password, salt, 32)) as Buffer;

    if (storedHash === hash.toString('hex')) {
      return {
        access_token: this.generateUserAccessToken(user),
      };
    }

    throw new BadRequestException('Incorrect credentials.');
  }
}
