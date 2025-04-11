import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseData } from './entities/response-data.entity';

@Injectable()
export class ResponsesService {
  constructor(
    @InjectRepository(ResponseData)
    private responseDataRepository: Repository<ResponseData>,
  ) {}

  async create(
    requestPayload: Record<string, unknown>,
    responseBody: Record<string, unknown>,
    statusCode: number,
  ): Promise<ResponseData> {
    const response = this.responseDataRepository.create({
      requestPayload,
      responseBody,
      statusCode,
      timestamp: new Date(),
    });
    return await this.responseDataRepository.save(response);
  }

  async findAll(): Promise<ResponseData[]> {
    return await this.responseDataRepository.find();
  }

  async findWithLimit(limit: number): Promise<ResponseData[]> {
    return await this.responseDataRepository.find({
      take: limit,
      order: { timestamp: 'DESC' },
    });
  }

  async findFrom(start: number, limit: number): Promise<ResponseData[]> {
    return await this.responseDataRepository
      .createQueryBuilder('responses')
      .select()
      .skip(start)
      .take(limit)
      .getMany();
  }
}
