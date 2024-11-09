import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Redirect,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ShortenUrlDto, ShortenUrlResponseDto } from './dto/shorten_url.dto';

@ApiTags('/')
@Controller('')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @ApiOperation({
    summary: 'get shorten url',
    description: 'Get shorten url',
  })
  @ApiBody({ type: ShortenUrlDto })
  @ApiResponse({
    type: ShortenUrlResponseDto,
  })
  @Post('/shorten')
  async shorten(@Body('url') url: string) {
    if (url === '') {
      return 'url cannot be empty';
    }
    return await this.urlService.createShortUrl(url);
  }

  @ApiOperation({
    summary: 'redirectToFullUrl',
    description: 'get full url by shortUrl parameter',
  })
  @ApiResponse({
    description: 'redirects client to fullUrl',
  })
  @Get(':shortUrl')
  @Redirect()
  async redirectToFullUrl(@Param('shortUrl') shortUrl: string) {
    if (shortUrl === '') {
      return 'shortUrl cannot be empty';
    }
    const url: string | null = await this.urlService.getFullUrl(shortUrl);
    return {
      statusCode: url === null ? HttpStatus.NOT_FOUND : HttpStatus.FOUND,
      url,
    };
  }
}
