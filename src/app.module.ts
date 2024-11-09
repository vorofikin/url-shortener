import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlModule } from './url/url.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { StatisticModule } from './statistic/statistic.module';
import * as cacheStore from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';
import { RateLimiterMiddleware } from './rate-limiter/rate-limiter.middleware';
import { UrlController } from './url/url.controller';
import { StatisticController } from './statistic/statistic.controller';
import * as process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: cacheStore,
      host: process.env.REDIS_HOST,
      port: 6379,
    }),
    UrlModule,
    StatisticModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimiterMiddleware)
      .forRoutes(UrlController, StatisticController);
  }
}
