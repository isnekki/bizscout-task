/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { PingService } from './ping.service';
import { HttpService } from '@nestjs/axios';
import { ResponsesService } from '../responses/responses.service';
import { of } from 'rxjs';
import { WebsocketGateway } from '../websocket/websocket.gateway';

describe('PingService', () => {
  let service: PingService;
  let httpService: HttpService;
  let responsesService: ResponsesService;
  let websocketGateway: WebsocketGateway;

  const mockHttpService = {
    post: jest.fn(() => of({ data: { mock: 'response' }, status: 200 } as any)),
  };

  const mockResponsesService = {
    create: jest.fn(() =>
      Promise.resolve({ id: 1, responseBody: { mock: 'response' } } as any),
    ),
  };

  const mockWebsocketGateway = {
    broadcastNewData: jest.fn(() => of({ data: { mock: 'response' } } as any)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PingService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ResponsesService, useValue: mockResponsesService },
        { provide: WebsocketGateway, useValue: mockWebsocketGateway },
      ],
    }).compile();

    service = module.get<PingService>(PingService);
    httpService = module.get<HttpService>(HttpService);
    responsesService = module.get<ResponsesService>(ResponsesService);
    websocketGateway = module.get<WebsocketGateway>(WebsocketGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('pingHttpBin', () => {
    it('should call httpService.post with the correct URL and payload', async () => {
      await service.pingHttpBin();
      expect(httpService.post).toHaveBeenCalledWith(
        'https://httpbin.org/anything',
        expect.any(Object),
      );
    });

    it('should call responsesServices.create with the response data and payload', async () => {
      const mockPayload = {
        timestamp: expect.any(String),
        randomNumber: expect.any(Number),
      };
      (httpService.post as jest.Mock).mockReturnValueOnce(
        of({ data: { mock: 'response', ...mockPayload }, status: 200 } as any),
      );
      await service.pingHttpBin();
      expect(responsesService.create).toHaveBeenCalledWith(
        mockPayload,
        { mock: 'response', ...mockPayload },
        200,
      );
    });
  });
});
