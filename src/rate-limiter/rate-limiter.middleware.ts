import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import {
  StatisticKeys,
  StatisticService,
} from '../statistic/statistic.service';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  static LIMIT_PER_MINUTE: number = 10;

  constructor(
    @Inject(StatisticService) private statisticService: StatisticService,
  ) {}

  async use(req: any, res: any, next: () => void) {
    const ip = req.ip;
    const requestsCount = await this.statisticService.get(
      StatisticKeys.RateLimiting,
      ip,
    );
    if (requestsCount >= RateLimiterMiddleware.LIMIT_PER_MINUTE) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    await this.statisticService.incrementKey(
      StatisticKeys.RateLimiting,
      ip,
      1000 * 60,
    );
    next();
  }
}
