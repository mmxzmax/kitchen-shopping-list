import { Inject, Logger, MiddlewareConsumer, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { REDIS } from '../redis/redis.constants';
import RedisStore from 'connect-redis';
import passport from 'passport';
import session from 'express-session';
import { RedisClientType } from 'redis';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [AuthModule, RedisModule],
  providers: [AppService, Logger],
  controllers: [AppController],
})
export class AppModule {
  store: RedisStore;
  constructor(@Inject(REDIS) private readonly redis: RedisClientType) {
    this.store = new RedisStore({
      client: this.redis,
      prefix: 'myapp:',
    });
  }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          store: this.store,
          saveUninitialized: false,
          secret: 'sup3rs3cr3t',
          resave: false,
          cookie: {
            sameSite: true,
            httpOnly: false,
            maxAge: 60000,
          },
        }),
        passport.initialize(),
        passport.session()
      )
      .forRoutes('*');
  }
}
