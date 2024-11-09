import { Test, TestingModule } from '@nestjs/testing';
import { StatisticKeys, StatisticService } from './statistic.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UrlService } from '../url/url.service';
import { getModelToken } from '@nestjs/mongoose';
import { Url } from '../url/url.schema';
import { mockDbUrlModel } from '../url/url.service.spec';

const mockData = {
  statisticKey: StatisticKeys.ClickCount,
  keySuffix: '5e3336',
};

const mockCacheService = {
  get: jest.fn((x) => x),
  set: jest.fn((x, y) => ({ x, y })),
  del: jest.fn(),
};

describe('StatisticService', () => {
  let service: StatisticService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticService,
        UrlService,
        {
          provide: getModelToken(Url.name),
          useValue: mockDbUrlModel,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<StatisticService>(StatisticService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should work', async () => {
    mockCacheService.get.mockResolvedValue(0);
    const result = await service.get(mockData.statisticKey, mockData.keySuffix);
    expect(result).toEqual(0);
  });

  it('should increment value', async () => {
    const initValue = 1;
    mockCacheService.get.mockResolvedValue(initValue);
    await service.incrementKey(mockData.statisticKey, mockData.keySuffix);
    expect(mockCacheService.set).toBeCalledWith(
      `${mockData.statisticKey}:${mockData.keySuffix}`,
      initValue + 1,
      undefined,
    );
  });
});
