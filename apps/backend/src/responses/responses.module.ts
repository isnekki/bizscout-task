import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseData } from './entities/response-data.entity';
import { ResponsesController } from './responses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ResponseData])],
  providers: [ResponsesService],
  controllers: [ResponsesController],
  exports: [ResponsesService],
})
export class ResponsesModule {}
