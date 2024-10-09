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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    RedisModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
  ],
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
