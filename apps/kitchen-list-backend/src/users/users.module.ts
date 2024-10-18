import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { UsersController } from './users.controller';
import { TgContactEntity } from './models/tg-contacts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TgContactEntity])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
