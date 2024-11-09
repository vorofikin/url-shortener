import { RateLimiterMiddleware } from './rate-limiter.middleware';
import { Test } from '@nestjs/testing';
import { StatisticService } from '../statistic/statistic.service';
import * as httpMocks from 'node-mocks-http';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UrlService } from '../url/url.service';
import { getModelToken } from '@nestjs/mongoose';
import { Url } from '../url/url.schema';
import { mockDbUrlModel } from '../url/url.service.spec';
import { HttpException } from '@nestjs/common';

const mockIpAddress = '123.123.123';
const mockRequest = httpMocks.createRequest({
  method: 'GET',
  url: '5e33ee',
  headers: {
    Origin: 'http://localhost:3000',
  },
  ip: mockIpAddress,
});

const mockStatisticService = {
  incrementKey: jest.fn((x) => x + 1),
  get: jest.fn((x) => x),
  _keyName: jest.fn((x, y) => `${x}:${y}`),
};

const mockResponse = httpMocks.createResponse();

const nextFunction = jest.fn();

describe('RateLimiterMiddleware', () => {
  let rateLimiterMiddleware: RateLimiterMiddleware;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RateLimiterMiddleware,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn((x) => x),
            set: jest.fn((x, y) => ({ x, y })),
            del: jest.fn(),
          },
        },
        {
          provide: StatisticService,
          useValue: mockStatisticService,
        },
        UrlService,
        {
          provide: getModelToken(Url.name),
          useValue: mockDbUrlModel,
        },
      ],
    }).compile();
    rateLimiterMiddleware = module.get<RateLimiterMiddleware>(
      RateLimiterMiddleware,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(rateLimiterMiddleware).toBeDefined();
  });

  it('should trigger next function', async () => {
    await rateLimiterMiddleware.use(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toBeCalled();
  });

  it('should throw HttpException because of the rate limit', async () => {
    mockStatisticService.get.mockResolvedValue(11);
    await expect(
      rateLimiterMiddleware.use(mockRequest, mockResponse, nextFunction),
    ).rejects.toThrow(HttpException);
  });

  it('should call statistic service', async () => {
    mockStatisticService.get.mockResolvedValue(1);
    await rateLimiterMiddleware.use(mockRequest, mockResponse, nextFunction);
    expect(mockStatisticService.get).toBeCalled();
    expect(mockStatisticService.incrementKey).toBeCalled();
  });
});
