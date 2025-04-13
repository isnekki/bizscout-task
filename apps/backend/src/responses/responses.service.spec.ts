/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponsesService } from './responses.service';
import { ResponseData } from './entities/response-data.entity';

describe('ResponsesService', () => {
  let service: ResponsesService;
  let repository: Repository<ResponseData>;

  // Mock data
  const mockResponseData = {
    id: 1,
    requestPayload: { test: 'data' },
    responseBody: { result: 'success' },
    statusCode: 200,
    timestamp: new Date(),
  };

  const mockResponseDataArray = [
    mockResponseData,
    {
      id: 2,
      requestPayload: { another: 'request' },
      responseBody: { result: 'error' },
      statusCode: 400,
      timestamp: new Date(Date.now() - 1000),
    },
  ];

  // Repository mock implementation
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResponsesService,
        {
          provide: getRepositoryToken(ResponseData),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ResponsesService>(ResponsesService);
    repository = module.get<Repository<ResponseData>>(
      getRepositoryToken(ResponseData),
    );

    // Reset mock calls before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new response data', async () => {
      const requestPayload = { test: 'data' };
      const responseBody = { result: 'success' };
      const statusCode = 200;

      jest.spyOn(repository, 'create').mockReturnValue(mockResponseData as any);
      jest.spyOn(repository, 'save').mockResolvedValue(mockResponseData as any);

      const result = await service.create(
        requestPayload,
        responseBody,
        statusCode,
      );

      expect(repository.create).toHaveBeenCalledWith({
        requestPayload,
        responseBody,
        statusCode,
        timestamp: expect.any(Date),
      });

      expect(repository.save).toHaveBeenCalledWith(mockResponseData);
      expect(result).toEqual(mockResponseData);
    });
  });

  describe('findAll', () => {
    it('should return an array of response data', async () => {
      jest
        .spyOn(repository, 'find')
        .mockResolvedValue(mockResponseDataArray as any);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(mockResponseDataArray);
    });
  });

  describe('findWithLimit', () => {
    it('should return response data with limit and ordered by timestamp DESC', async () => {
      const limit = 10;

      jest
        .spyOn(repository, 'find')
        .mockResolvedValue(mockResponseDataArray as any);

      const result = await service.findWithLimit(limit);

      expect(repository.find).toHaveBeenCalledWith({
        take: limit,
        order: { timestamp: 'DESC' },
      });

      expect(result).toEqual(mockResponseDataArray);
    });
  });

  describe('findFrom', () => {
    it('should return response data with skip and take', async () => {
      const start = 5;
      const limit = 10;
      const queryBuilder = repository.createQueryBuilder('responses');

      jest
        .spyOn(queryBuilder, 'getMany')
        .mockResolvedValue(mockResponseDataArray as any);

      const result = await service.findFrom(start, limit);

      expect(repository.find).toHaveBeenCalledWith({
        skip: start - 1,
        take: limit,
      });
      expect(result).toEqual(mockResponseDataArray);
    });

    it('should work without limit parameter', async () => {
      const start = 5;
      const queryBuilder = repository.createQueryBuilder();

      jest
        .spyOn(queryBuilder, 'getMany')
        .mockResolvedValue(mockResponseDataArray as any);

      const result = await service.findFrom(start);

      expect(repository.find).toHaveBeenCalledWith({ skip: start - 1 });
      expect(result).toEqual(mockResponseDataArray);
    });
  });
});
