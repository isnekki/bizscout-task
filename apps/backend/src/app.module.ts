import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataController } from './data/data.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { PingModule } from './ping/ping.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { ResponsesModule } from './responses/responses.module';
import { WebsocketModule } from './websocket/websocket.module';
import { ResponseData } from './responses/entities/response-data.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PingModule,
    ResponsesModule,
    WebsocketModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'responses.db',
      entities: [ResponseData],
      synchronize: true,
    }),
  ],
  controllers: [AppController, DataController],
  providers: [AppService, WebsocketGateway],
})
export class AppModule {}
