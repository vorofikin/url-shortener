import { ApiProperty } from '@nestjs/swagger';

export class GetUrlStatisticDto {
  @ApiProperty({ example: '5eea3e5d', required: true, description: 'shortUrl' })
  readonly code: string;
}

export class GetUrlStatisticResponseDto {
  readonly code: string;
  readonly clickCounts: number;
  readonly fullUrl: string;
}
