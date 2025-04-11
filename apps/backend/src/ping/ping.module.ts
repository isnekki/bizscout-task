import { Module } from '@nestjs/common';
import { PingService } from './ping.service';
import { HttpModule } from '@nestjs/axios';
import { WebsocketModule } from 'src/websocket/websocket.module';
import { ResponsesModule } from 'src/responses/responses.module';

@Module({
  imports: [HttpModule, ResponsesModule, WebsocketModule],
  providers: [PingService],
})
export class PingModule {}
