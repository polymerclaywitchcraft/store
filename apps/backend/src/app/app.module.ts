import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'node:path';

console.log(path.join(__dirname, '..', 'frontend'));

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'frontend'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
