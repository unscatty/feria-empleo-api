import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadedImage } from './entitities/uploaded-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UploadedImage])],
})
export class SharedModule {}
