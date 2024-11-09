import { Controller, Get, Inject, Param } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUrlStatisticResponseDto } from './dto/statistic.dto';

@ApiTags('/stats')
@Controller('stats')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @ApiOperation({ summary: 'get click statistic for url' })
  @ApiResponse({ type: GetUrlStatisticResponseDto })
  @Get(':code')
  async redirectToFullUrl(@Param('code') code: string) {
    if (code === '') {
      return 'code cannot be empty';
    }
    return await this.statisticService.getClickStatistic(code);
  }
}
