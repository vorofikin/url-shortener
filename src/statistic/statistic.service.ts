import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache, Milliseconds } from 'cache-manager';
import { GetUrlStatisticResponseDto } from './dto/statistic.dto';
import { UrlService } from '../url/url.service';

export enum StatisticKeys {
  ClickCount = 'ClickCount',
  RateLimiting = 'RateLimiting',
}

@Injectable()
export class StatisticService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(forwardRef(() => UrlService))
    private readonly urlService: UrlService,
  ) {}

  async incrementKey(
    statisticKey: StatisticKeys,
    keySuffix: string,
    ttl?: Milliseconds,
  ): Promise<void> {
    const key = this._keyName(statisticKey, keySuffix);
    const value = await this.cacheManager.get<number>(key);
    await this.cacheManager.del(key);
    await this.cacheManager.set(key, value === undefined ? 0 : value + 1, ttl);
  }

  async get(statisticKey: StatisticKeys, keySuffix: string): Promise<number> {
    const value = await this.cacheManager.get<number>(
      this._keyName(statisticKey, keySuffix),
    );
    return !value ? 0 : value;
  }

  async getClickStatistic(code: string): Promise<GetUrlStatisticResponseDto> {
    const value = await this.get(StatisticKeys.ClickCount, code);
    const fullUrl = await this.urlService.getFullUrl(code, false);
    return {
      clickCounts: value,
      fullUrl,
      code,
    };
  }

  private _keyName(statisticKey: StatisticKeys, keySuffix: string): string {
    return `${statisticKey.toString()}:${keySuffix}`;
  }
}
