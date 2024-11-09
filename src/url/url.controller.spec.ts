import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getModelToken } from '@nestjs/mongoose';
import { Url, UrlSchema } from './url.schema';
import { StatisticService } from '../statistic/statistic.service';

const mockUrlDocument = {
  _id: '_mock_id',
  fullUrl: 'example.com',
  shortUrl: '5e3356',
};

const mockUrlService = {
  createShortUrl: jest.fn().mockResolvedValue(mockUrlDocument),
};

const mockCacheService = {
  get: jest.fn((x) => x),
  set: jest.fn((x, y) => ({ x, y })),
  del: jest.fn(),
};

const mockDbUrlModel = {
  findOne: jest.fn().mockResolvedValue(mockUrlDocument),
  save: jest.fn().mockResolvedValue(mockUrlDocument),
};

class MockDbUrlModel {
  shortUrl: string;
  fullUrl: string = mockUrlDocument.fullUrl;

  constructor(_: any) {}

  new = jest.fn().mockResolvedValue({});
  static findOne = jest.fn().mockResolvedValue(mockUrlDocument);
  save = jest.fn().mockResolvedValue(mockUrlDocument);

  this = mockUrlDocument;
}

describe('UrlController', () => {
  let controller: UrlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        UrlService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheService,
        },
        {
          provide: getModelToken(Url.name),
          useValue: MockDbUrlModel,
        },
        StatisticService,
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
