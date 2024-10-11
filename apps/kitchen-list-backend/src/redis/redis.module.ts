import { Module } from '@nestjs/common';
import * as Redis from 'redis';

import { REDIS } from './redis.constants';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: REDIS,
      useFactory: async (configService: ConfigService) => {
        return await Redis.createClient({
          url: configService.get('REDIS_URL'),
        })
          .on('error', (err) => console.error('Redis Client Error', err))
          .connect();
      },
      inject:[ConfigService]
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
