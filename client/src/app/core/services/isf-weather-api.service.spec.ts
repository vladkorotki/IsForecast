import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { IWeatherResponse } from '../types/weather.types';
import { IsfWeatherApiService } from './isf-weather-api.service';

describe('IsfWeatherApiService', () => {
  let service: IsfWeatherApiService;
  let httpMock: HttpTestingController;
  const baseUrl = '/api/weather';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsfWeatherApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(IsfWeatherApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send GET request with location param', () => {
    const mockResponse = {
      location: {},
      payload: {},
      stale: false,
      fetchedAt: '',
    } as IWeatherResponse;

    service.getWeather({ location: 'Minsk' }).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}?location=Minsk`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should encode location param properly', () => {
    service.getWeather({ location: 'New York' }).subscribe();

    const req = httpMock.expectOne(`${baseUrl}?location=New%20York`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should send GET request with lat and lon params', () => {
    const mockResponse = {
      location: {},
      payload: {},
      stale: false,
      fetchedAt: '',
    } as IWeatherResponse;

    service.getWeather({ lat: 53.9, lon: 27.5 }).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}?lat=53.9&lon=27.5`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
