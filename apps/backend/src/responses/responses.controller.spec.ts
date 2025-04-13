/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ResponsesController } from './responses.controller';
import { ResponsesService } from './responses.service';
import { ResponseData } from './entities/response-data.entity';

describe('ResponsesController', () => {
  let controller: ResponsesController;
  let responsesService: ResponsesService;

  /**
   * 1. Instantiate the controller with the correct parameters
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResponsesController],
      providers: [
        {
          provide: ResponsesService,
          useValue: {
            findAll: jest.fn(),
            findWithLimit: jest.fn(),
            findFrom: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ResponsesController>(ResponsesController);
    responsesService = module.get<ResponsesService>(ResponsesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getResponses', () => {
    const mockResponseData: ResponseData[] = [
      {
        id: 1,
        requestPayload: { test: 'payload1' },
        responseBody: { result: 'success1' },
        statusCode: 200,
        timestamp: new Date('2024-01-01T00:00:00Z'),
      },
      {
        id: 2,
        requestPayload: { test: 'payload2' },
        responseBody: { result: 'success2' },
        statusCode: 201,
        timestamp: new Date('2024-01-01T00:01:00Z'),
      },
      {
        id: 3,
        requestPayload: { test: 'payload3' },
        responseBody: { result: 'success3' },
        statusCode: 200,
        timestamp: new Date('2024-01-01T00:02:00Z'),
      },
      {
        id: 4,
        requestPayload: { test: 'payload4' },
        responseBody: { result: 'success4' },
        statusCode: 201,
        timestamp: new Date('2024-01-01T00:03:00Z'),
      },
      {
        id: 5,
        requestPayload: { test: 'payload5' },
        responseBody: { result: 'success5' },
        statusCode: 200,
        timestamp: new Date('2024-01-01T00:04:00Z'),
      },
      {
        id: 6,
        requestPayload: { test: 'payload6' },
        responseBody: { result: 'success6' },
        statusCode: 201,
        timestamp: new Date('2024-01-01T00:05:00Z'),
      },
      {
        id: 7,
        requestPayload: { test: 'payload7' },
        responseBody: { result: 'success7' },
        statusCode: 200,
        timestamp: new Date('2024-01-01T00:06:00Z'),
      },
      {
        id: 8,
        requestPayload: { test: 'payload8' },
        responseBody: { result: 'success8' },
        statusCode: 201,
        timestamp: new Date('2024-01-01T00:07:00Z'),
      },
      {
        id: 9,
        requestPayload: { test: 'payload9' },
        responseBody: { result: 'success9' },
        statusCode: 200,
        timestamp: new Date('2024-01-01T00:08:00Z'),
      },
      {
        id: 10,
        requestPayload: { test: 'payload10' },
        responseBody: { result: 'success10' },
        statusCode: 201,
        timestamp: new Date('2024-01-01T00:09:00Z'),
      },
      {
        id: 11,
        requestPayload: { test: 'payload11' },
        responseBody: { result: 'success11' },
        statusCode: 200,
        timestamp: new Date('2024-01-01T00:10:00Z'),
      },
      {
        id: 12,
        requestPayload: { test: 'payload12' },
        responseBody: { result: 'success12' },
        statusCode: 201,
        timestamp: new Date('2024-01-01T00:11:00Z'),
      },
    ];

    /**
     * 1. Mock the findAll function to return the dummy data
     * 2. Call the getResponses function
     * 3. Expect the correct functions to be called and to return the correct data
     */
    it('should call responsesService.findAll when no query parameters are provided', async () => {
      (responsesService.findAll as jest.Mock).mockResolvedValue(
        mockResponseData,
      );

      const result = await controller.getResponses();

      expect(responsesService.findAll).toHaveBeenCalled();
      expect(responsesService.findWithLimit).not.toHaveBeenCalled();
      expect(responsesService.findFrom).not.toHaveBeenCalled();
      expect(result).toEqual(mockResponseData);
    });

    /**
     * 1. Mock the findWithLimit function to return the sliced dummy data
     * 2. Call the getResponses function with the limit parameter
     * 3. Expect the correct functions to be called and to return the correct data
     */
    it('should call responseService.findWithLimit when only limit is provided', async () => {
      const limit = '2';
      const parsedLimit = parseInt(limit);
      const limitedResponses = mockResponseData.slice(0, parsedLimit);

      (responsesService.findWithLimit as jest.Mock).mockResolvedValue(
        limitedResponses,
      );

      const result = await controller.getResponses(limit);
      expect(responsesService.findAll).not.toHaveBeenCalled();
      expect(responsesService.findWithLimit).toHaveBeenCalled();
      expect(responsesService.findFrom).not.toHaveBeenCalled();
      expect(result).toEqual(limitedResponses);
    });

    /**
     * Same as above test but with a starting point and a limit parameter
     */
    it('should call responseService.findRom when both limit and start is provided', async () => {
      const limit = '3';
      const start = '5';
      const parsedLimit = parseInt(limit);
      const parsedStart = parseInt(start);
      const limitedResponses = mockResponseData.slice(parsedStart, parsedLimit);
      (responsesService.findFrom as jest.Mock).mockResolvedValue(
        limitedResponses,
      );

      const result = await controller.getResponses(limit, start);
      expect(responsesService.findAll).not.toHaveBeenCalled();
      expect(responsesService.findWithLimit).not.toHaveBeenCalled();
      expect(responsesService.findFrom).toHaveBeenCalled();
      expect(result).toEqual(limitedResponses);
    });
  });
});
