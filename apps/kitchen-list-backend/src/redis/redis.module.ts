import { Module } from '@nestjs/common';
import * as Redis from 'redis';

import { REDIS } from './redis.constants';

@Module({
  providers: [
    {
      provide: REDIS,
      useFactory: async () => {
        return await Redis.createClient()
          .on('error', (err) => console.log('Redis Client Error', err))
          .connect();
      },
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
