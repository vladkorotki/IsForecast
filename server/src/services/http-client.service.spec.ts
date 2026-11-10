import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { HttpClientService } from './http-client.service.js';

describe('HttpClientService', () => {
  let service: HttpClientService;
  let mockAxios: MockAdapter;
  const testUrl = 'https://api.test.com/data';

  beforeEach(() => {
    service = new HttpClientService();

    // @ts-expect-error - ignore conflict between axios & axios-mock-adapter в ESM
    mockAxios = new MockAdapter(axios);
  });

  it('should return data on successful GET', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockAxios.onGet(testUrl).reply(200, mockData);

    const result = await firstValueFrom(service.get(testUrl));

    expect(result).toEqual(mockData);
  });

  it('should format error with response status and message', async () => {
    mockAxios.onGet(testUrl).reply(404, { message: 'Not Found' });

    try {
      await firstValueFrom(service.get(testUrl));
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.status).toBe('404');
      expect(error.message).toBe('Not Found');
    }
  });

  it('should use fallback message if response has no message', async () => {
    mockAxios.onGet(testUrl).reply(500, {});

    try {
      await firstValueFrom(service.get(testUrl));
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.status).toBe('500');
      expect(error.message).toBe('Server error with status 500');
    }
  });

  it('should handle network error (no response)', async () => {
    mockAxios.onGet(testUrl).reply(() => {
      const error = new Error('Network Error') as any;
      error.request = {};
      throw error;
    });

    try {
      await firstValueFrom(service.get(testUrl));
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.status).toBe('504');
      expect(error.message).toBe('Сервер не отвечает. Проверьте сетевое соединение.');
    }
  });

  it('should handle timeout error', async () => {
    mockAxios.onGet(testUrl).reply(() => {
      const error = new Error('Timeout') as any;
      error.request = {};
      throw error;
    });

    try {
      await firstValueFrom(service.get(testUrl));
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.status).toBe('504');
      expect(error.message).toBe('Сервер не отвечает. Проверьте сетевое соединение.');
    }
  });

  it('should handle other errors (e.g. request setup error)', async () => {
    mockAxios.onGet(testUrl).reply(() => {
      throw new Error('Setup error');
    });

    try {
      await firstValueFrom(service.get(testUrl));
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.status).toBe('500');
      expect(error.message).toBe('Setup error');
    }
  });
});
