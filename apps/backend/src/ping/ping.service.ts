import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { ResponsesService } from '../responses/responses.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class PingService {
  constructor(
    private readonly httpService: HttpService,
    private readonly responsesService: ResponsesService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async pingHttpBin() {
    const payload = this.generateRandomPayload();

    try {
      const response: AxiosResponse<any> = await lastValueFrom(
        this.httpService.post('https://httpbin.org/anything', payload),
      );
      await this.processResponse(
        response.data as Record<string, unknown>,
        payload,
        response.status,
      );
    } catch (error) {
      console.error('Error pinging httpbin:', error);
    }
  }

  private generateRandomPayload(): Record<string, any> {
    return {
      timestamp: new Date().toISOString(),
      randomNumber: Math.random(),
    };
  }

  private async processResponse(
    responseData: Record<string, unknown>,
    requestPayload: Record<string, unknown>,
    statusCode: number,
  ) {
    try {
      const savedResponse = await this.responsesService.create(
        requestPayload,
        responseData,
        statusCode,
      );

      this.websocketGateway.broadcastNewData(savedResponse);
    } catch (error) {
      console.error('Error saving to database: ', error);
    }
  }
}
