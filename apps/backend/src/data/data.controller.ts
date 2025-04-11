import { Controller, Get, Param, ParseIntPipe, Req } from '@nestjs/common';

@Controller('data')
export class DataController {
  @Get()
  findAll(): string {
    return 'found';
  }

  @Get('history/:index')
  getHistory(
    @Req() req: Request,
    @Param('index', ParseIntPipe) index: number,
  ): object {
    return { hello: 'hello world!' };
  }
}
