import { Controller, Get, Query } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponseData } from './entities/response-data.entity';
import type { Data } from '@repo/types';

@Controller('api/responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @Get()
  async getResponses(
    @Query('limit') limit?: string,
    @Query('start') start?: string,
  ): Promise<ResponseData[] | undefined> {
    try {
      if (limit && !isNaN(parseInt(limit, 10))) {
        if (start && !isNaN(parseInt(start, 10))) {
          return this.responsesService.findFrom(
            parseInt(start, 10),
            parseInt(limit, 10),
          ) satisfies Promise<Data[]>;
        }
        return this.responsesService.findWithLimit(
          parseInt(limit, 10),
        ) satisfies Promise<Data[]>;
      }
      if (start && !isNaN(parseInt(start, 10))) {
        return this.responsesService.findFrom(
          parseInt(start, 10),
        ) satisfies Promise<Data[]>;
      }
      return this.responsesService.findAll() satisfies Promise<Data[]>;
    } catch (error) {
      console.error('Error getting responses from DB: ', error);
      throw new Error('DB Error');
    }
  }
}
