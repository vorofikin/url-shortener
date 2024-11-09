import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Url extends Document {
  @ApiProperty({ example: 'example.com', required: true })
  @Prop({ required: true })
  fullUrl: string;

  @ApiProperty({ example: 'uuid', required: true })
  @Prop({ required: true })
  shortUrl: string;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
