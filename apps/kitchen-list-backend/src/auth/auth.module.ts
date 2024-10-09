import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { AuthSerializer } from './serialization.provider';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
    UsersService,
  ],
  providers: [AuthService, LocalStrategy, AuthSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
