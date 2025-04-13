import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseData } from './entities/response-data.entity';

/**
 * The service responsible for storing data in the database
 */
@Injectable()
export class ResponsesService {
  /**
   * This creates a constructor for our database responses service
   *
   * @param responseDataRepository The database repository object in charge of storing data to our SQlite database
   */
  constructor(
    @InjectRepository(ResponseData)
    private responseDataRepository: Repository<ResponseData>,
  ) {}

  /**
   * This function creates a row in the database
   *
   * @param requestPayload The payload sent to httpbin
   * @param responseBody The response body received from httpbin
   * @param statusCode The status code of the request
   * @returns The row saved
   */
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

  /**
   * This function queries all rows in the database
   *
   * @returns all rows in the database
   */
  async findAll(): Promise<ResponseData[]> {
    return await this.responseDataRepository.find();
  }

  /**
   * This function queries a specific number of rows from the database starting from the latest rows descending
   *
   * @param limit The limit of rows to query
   * @returns an array containing rows from the database with the array length equal to the limit
   */
  async findWithLimit(limit: number): Promise<ResponseData[]> {
    return await this.responseDataRepository.find({
      take: limit,
      order: { timestamp: 'DESC' },
    });
  }

  /**
   * This function queries a specific number of rows from a given starting row descending
   *
   * @param start The starting point of the query
   * @param limit The limit of rows to query
   * @returns an array containing rows from the database from a starting point and with the array length equal to the limit
   */
  async findFrom(start: number, limit?: number): Promise<ResponseData[]> {
    return await this.responseDataRepository.find({
      skip: start - 1,
      take: limit,
    });
  }
}
