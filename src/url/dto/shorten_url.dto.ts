import { ApiProperty } from '@nestjs/swagger';

export class ShortenUrlDto {
  @ApiProperty({
    examples: ['example.com', 'https://example.com'],
    required: true,
  })
  readonly url: string;
}

export class ShortenUrlResponseDto {
  @ApiProperty({})
  readonly fullUrl: string;
  @ApiProperty({})
  readonly shortUrl: string;
}
