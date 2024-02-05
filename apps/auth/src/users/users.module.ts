import { DatabaseModule, LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { UsersDocument, UsersSchema } from './models/users.schema';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UsersDocument.name, schema: UsersSchema },
    ]),
   LoggerModule
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository]
})
export class UsersModule {}
