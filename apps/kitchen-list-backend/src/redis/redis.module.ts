import { Module } from '@nestjs/common';
import * as Redis from 'redis';

import { REDIS } from './redis.constants';

@Module({
  providers: [
    {
      provide: REDIS,
      useFactory: async () => {
        return await Redis.createClient({
          url: 'redis://redis:6379'
        })
          .on('error', (err) => console.error('Redis Client Error', err))
          .connect();
      },
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
