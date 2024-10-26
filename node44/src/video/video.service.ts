import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideoDto } from './dto/Video.dto';
import { PrismaClient } from '@prisma/client';
import { plainToClass } from 'class-transformer';

@Injectable()
export class VideoService {
  prima = new PrismaClient();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createVideoDto: CreateVideoDto) {
    return 'This action adds a new video';
  }

  async findAll(
    page: number,
    size: number,
    keyword: string,
  ): Promise<VideoDto[]> {
    try {
      let videos = await this.prima.video.findMany({
        where: keyword
          ? {
              video_name: {
                contains: keyword,
              },
            }
          : {},
        skip: (page - 1) * size,
        take: size,
      });
      return videos.map((video) => plainToClass(VideoDto, video));
    } catch (error) {
      throw new Error(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} video`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
