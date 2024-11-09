import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './url.schema';
import { StatisticModule } from '../statistic/statistic.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Url.name,
        schema: UrlSchema,
      },
    ]),
    StatisticModule,
  ],
  controllers: [UrlController],
  providers: [UrlService],
  exports: [UrlService],
})
export class UrlModule {}
