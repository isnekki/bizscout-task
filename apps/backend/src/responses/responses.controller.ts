import { Controller, Get, Query } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponseData } from './entities/response-data.entity';

@Controller('api/responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @Get()
  async getResponses(
    @Query('limit') limit?: string,
    @Query('start') start?: string,
  ): Promise<ResponseData[]> {
    if (limit && !isNaN(parseInt(limit, 10))) {
      if (start && !isNaN(parseInt(start, 10))) {
        return this.responsesService.findFrom(
          parseInt(start, 10),
          parseInt(limit, 10),
        );
      }
      return this.responsesService.findWithLimit(parseInt(limit, 10));
    }
    return this.responsesService.findAll();
  }
}
