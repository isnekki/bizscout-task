import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule/dist/decorators/cron.decorator';
import { CronExpression } from '@nestjs/schedule/dist/enums/cron-expression.enum';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PingService {
  constructor(private readonly httpService: HttpService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async pingHttpBin() {
    const payload = this.generateRandomPayload();

    try {
      const response: AxiosResponse<unknown> = await lastValueFrom(
        this.httpService.post('https://httpbin.org/anything', payload),
      );
      this.processResponse(response.data, payload);
    } catch (error) {
      console.error('Error pingint HTTP bin: ', error);
    }
  }

  private generateRandomPayload(): Record<string, any> {
    return {
      timestamp: new Date().toISOString(),
      randomNumber: Math.random(),
    };
  }

  private processResponse(responseData: unknown, requestPayload: unknown) {
    console.log('Received response: ', responseData);
    console.log('Received payload: ', requestPayload);
  }
}
