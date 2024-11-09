import { forwardRef, Module } from '@nestjs/common';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { UrlModule } from '../url/url.module';

@Module({
  imports: [forwardRef(() => UrlModule)],
  controllers: [StatisticController],
  providers: [StatisticService],
  exports: [StatisticService],
})
export class StatisticModule {}
