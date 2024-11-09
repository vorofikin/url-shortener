import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Url } from './url.schema';
import { v4 as uuid } from 'uuid';
import { Model } from 'mongoose';
import {
  StatisticKeys,
  StatisticService,
} from '../statistic/statistic.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UrlService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(Url.name) private urlModel: Model<Url>,
    @Inject(forwardRef(() => StatisticService))
    private readonly statisticService: StatisticService,
  ) {}

  async createShortUrl(fullUrl: string): Promise<Url> {
    try {
      const url = new URL(fullUrl).toString();
      const shortUrl = uuid().slice(0, 8);
      const urlDoc = new this.urlModel({
        shortUrl,
        fullUrl: url,
      });
      await urlDoc.save();
      await this.cacheManager.set(shortUrl, url);
      return urlDoc;
    } catch (e) {
      throw new BadRequestException('wrong url parameter');
    }
  }

  async getFullUrl(
    shortUrl: string,
    needIncrement: boolean = true,
  ): Promise<string | null> {
    try {
      const fullUrl = await this.cacheManager.get<string>(shortUrl);
      if (fullUrl) return fullUrl;
      const doc = await this.urlModel.findOne({ shortUrl });
      await this.cacheManager.set(shortUrl, doc.fullUrl);
      if (needIncrement) {
        await this.statisticService.incrementKey(
          StatisticKeys.ClickCount,
          shortUrl,
        );
      }
      return doc.fullUrl;
    } catch (e) {
      throw new BadRequestException(e.toString());
    }
  }
}
