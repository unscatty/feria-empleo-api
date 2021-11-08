import { UploadedFileMetadata } from '@nestjs/azure-storage';

export class UpdateImageDto {
  image: UploadedFileMetadata;
}
