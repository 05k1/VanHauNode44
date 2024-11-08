import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { VideoType } from '../enum/video_type.enum';

export class CreateVideoDto {
  @IsNotEmpty({ message: 'Video Name khong duoc de trong' })
  @ApiProperty() // show property ra swagger
  video_name: string;

  @IsNotEmpty({ message: 'Thumbnail khong duoc de trong' })
  @ApiProperty() // show property ra swagger
  thumbnail: string;

  @IsNotEmpty({ message: 'description khong duoc de trong' })
  @ApiProperty() // show property ra swagger
  description: string;

  @ApiProperty() // show property ra swagger
  views: number;

  @IsNotEmpty({ message: 'Source khong duoc de trong' })
  @ApiProperty() // show property ra swagger
  source: string;

  user_id: number;

  @ApiProperty({ enum: VideoType })
  @IsEnum(VideoType)
  type_id: number;
}

// ip 1 hinh
export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  hinhAnh: any;
}

// up nhieu hinh
export class FilesUploadDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  hinhAnh: any[];
}
