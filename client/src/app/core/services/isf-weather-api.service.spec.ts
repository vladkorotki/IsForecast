import { TestBed } from '@angular/core/testing';
import { IsfWeatherApiService } from './isf-weather-api.service';

describe('IsfWeatherApiService', () => {
  let service: IsfWeatherApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsfWeatherApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
