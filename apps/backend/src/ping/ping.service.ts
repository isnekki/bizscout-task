import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { ResponsesService } from '../responses/responses.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class PingService {
  /**
   * This is the PingService object. This will handle the scheduled pings to httpbin
   * passing along with it randomly generated JSON data as the request payload
   *
   * @param httpService The HttpService object for calling HTTP requests to httpbin
   * @param responsesService The Service object for storing data in the SQlite database
   * @param websocketGateway The WebSocket Gateway for updating data on the frontend
   */
  constructor(
    private readonly httpService: HttpService,
    private readonly responsesService: ResponsesService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  // Ping httpbin every 5 minutes using a cron job
  @Cron(CronExpression.EVERY_5_MINUTES)
  async pingHttpBin() {
    const payload = this.generateRandomPayload(); // Generate random payload

    try {
      const response: AxiosResponse<any> = await lastValueFrom(
        this.httpService.post('https://httpbin.org/anything', payload), // Make a POST request to httpbin with generated payload
      );

      // Pass response from httpbin to a database handler function
      await this.processResponse(
        response.data as Record<string, unknown>,
        payload,
        response.status,
      );
    } catch (error) {
      console.error('Error pinging httpbin:', error);
    }
  }

  // Helper function for generating random payload
  private generateRandomPayload(): Record<string, any> {
    return {
      timestamp: new Date().toISOString(),
      randomNumber: Math.random(),
    };
  }

  // Helper function for saving request and response data to the database and broadcast new data through the websocket
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
