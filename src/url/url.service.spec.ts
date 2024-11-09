import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { Url } from './url.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getModelToken } from '@nestjs/mongoose';
import { StatisticService } from '../statistic/statistic.service';
import { BadRequestException } from '@nestjs/common';

export const mockUrlDocument = {
  _id: '_mock_id',
  fullUrl: 'example.com',
  shortUrl: '5e3356',
};

export const mockDbUrlModel = {
  findOne: jest.fn().mockResolvedValue(mockUrlDocument),
  save: jest.fn().mockResolvedValue(mockUrlDocument),
};

describe('UrlService', () => {
  let service: UrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn((x) => x),
            set: jest.fn((x, y) => ({ x, y })),
            del: jest.fn(),
          },
        },
        {
          provide: getModelToken(Url.name),
          useValue: mockDbUrlModel,
        },
        StatisticService,
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a short code and save it in Redis and MongoDB', async () => {
    jest
      .spyOn(service, 'createShortUrl')
      .mockResolvedValue(mockUrlDocument as Url);
    const result = await service.createShortUrl(mockUrlDocument.fullUrl);
    expect(result).toBe(mockUrlDocument);
    expect(service.createShortUrl).toBeCalledTimes(1);
  });

  it('should throw BadRequestException', async () => {
    await expect(service.createShortUrl('wrong-url')).rejects.toThrow(
      BadRequestException,
    );
  });
});
