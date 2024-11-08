import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudUploadServeice } from './cloudUpload.service';

@Module({
  imports: [CloudinaryModule],
  providers: [CloudUploadServeice],
  exports: [CloudUploadServeice],
})
export class SharedModule {}
