import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideoModule } from './video/video.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [VideoModule, ConfigModule.forRoot({ isGlobal: true }), AuthModule], // load tat ca cac bien moi truomg va sudung moi noi
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
