import { Controller, Get, Query } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponseData } from './entities/response-data.entity';
import type { Data } from '@repo/types';

/**
 * The REST API endpoint for querying ping historical data from the database
 */
@Controller('api/responses')
export class ResponsesController {
  /**
   * This is the constructor tasked with handling responses to the HTTP requests
   *
   * @param responsesService The service in charge of handling queries to the database
   */
  constructor(private readonly responsesService: ResponsesService) {}

  /**
   * The GET handler for querying data from the database
   *
   * @param limit The number of rows to be returned
   * @param start The starting row that the query will run
   * @returns Promise<Data[]> referring to the queried data
   */
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
