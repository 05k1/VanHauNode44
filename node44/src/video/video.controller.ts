import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Headers,
  Res,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { VideoService } from './video.service';
import {
  CreateVideoDto,
  FilesUploadDto,
  FileUploadDto,
} from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideoDto } from './dto/Video.dto';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { getStorageOption } from 'src/shared/upload.service';
import { CloudUploadServeice } from 'src/shared/cloudUpload.service';

@ApiTags('Video') // chia cum api
@Controller('video')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly cloudUploadService: CloudUploadServeice,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('create-video')
  async create(
    @Body() createVideoDto: CreateVideoDto,
    @Res() res: Response,
  ): Promise<Response<VideoDto>> {
    let newVideo = await this.videoService.create(createVideoDto);
    return res.status(HttpStatus.CREATED).json(newVideo);
  }

  @Get('get-video')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiHeader({ name: 'token', required: false })
  @ApiResponse({ status: HttpStatus.OK, description: 'Get list video success' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server',
  })
  async findAll(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('keyword') keyword: string,
    @Headers('token') token: string,
    @Res() res: Response,
  ): Promise<Response<VideoDto[]>> {
    try {
      // return res.status(HttpStatus.OK).json({ page, size, keyword, token });
      // format data type page size
      const formatPage = page ? Number(page) : 1;
      const formatSize = size ? Number(size) : 10;
      let videos = await this.videoService.findAll(
        formatPage,
        formatSize,
        keyword,
      );
      return res.status(HttpStatus.OK).json(videos);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Post('upload-thumbnail')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
    required: true,
  })
  @UseInterceptors(
    FileInterceptor('hinhAnh', { storage: getStorageOption('videos') }),
  )
  uploadThumbnail(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    return res.status(200).json(file);
  }

  @Post('upload-thumbnail-cloud')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
    required: true,
  })
  @UseInterceptors(FileInterceptor('hinhAnh'))
  async uploadThumbnailCloud(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      const result = await this.cloudUploadService.uploadImage(file, 'videos');
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'upload failed' });
    }
  }

  @Post('upload-multi-thumbnail')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FilesUploadDto,
    required: true,
  })
  @UseInterceptors(
    FilesInterceptor('hinhAnh', 20, { storage: getStorageOption('videos') }),
  )
  uploadMultipleThumbnail(
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ) {
    return res.status(200).json(files);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(+id);
  }
}
