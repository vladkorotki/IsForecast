import { TestBed } from '@angular/core/testing';
import { IsfChartService } from './isf-chart.service';

describe('IsfChartService', () => {
  let service: IsfChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsfChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
