import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { AuthSerializer } from './serialization.provider';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
    UsersModule,
  ],
  providers: [AuthService, LocalStrategy, AuthSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
