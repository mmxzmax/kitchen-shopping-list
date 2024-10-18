import { Module } from '@nestjs/common';
import { TgService } from './tg.service';
import { TG_BOT } from './tg-bot-provider';
import { ConfigService } from '@nestjs/config';
import TelegramBot from 'node-telegram-bot-api';
import { UsersModule } from '../users/users.module';
import { TgController } from './tg.controller';
import { UserShopListModule } from '../user-shop-list/user-shop-list.module';

@Module({
  imports: [UsersModule, UserShopListModule],
  providers: [
    TgService,
    {
      provide: TG_BOT,
      useFactory: async (config: ConfigService) => {
        return new TelegramBot(config.get('TG_BOT_KEY'), { polling: true });
      },
      inject: [ConfigService],
    },
  ],
  exports: [TgService],
  controllers: [TgController],
})
export class TgModule {}
