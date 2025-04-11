import { Module } from '@nestjs/common';
import { PingService } from './ping.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PingService],
})
export class PingModule {}
