import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Chart, ChartConfiguration } from 'chart.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IsfHourlyChartComponent } from './isf-hourly-chart.component';

vi.mock('chart.js', () => {
  return {
    Chart: vi.fn(),
    registerables: [],
  };
});

describe('IsfHourlyChartComponent', () => {
  let component: IsfHourlyChartComponent;
  let fixture: ComponentFixture<IsfHourlyChartComponent>;

  const mockConfig: ChartConfiguration = {
    type: 'line',
    data: {
      labels: ['12:00', '13:00'],
      datasets: [],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsfHourlyChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IsfHourlyChartComponent);
    component = fixture.componentInstance;

    const canvas = document.createElement('canvas');
    const mockContext = {};
    canvas.getContext = vi.fn().mockReturnValue(mockContext);

    const viewChildRef = component as unknown as {
      chartCanvas: () => { nativeElement: HTMLCanvasElement };
    };
    vi.spyOn(viewChildRef, 'chartCanvas').mockReturnValue({ nativeElement: canvas });

    fixture.componentRef.setInput('config', mockConfig);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize Chart in ngAfterViewInit', () => {
    fixture.detectChanges();

    expect(Chart).toHaveBeenCalledTimes(1);
    expect(Chart).toHaveBeenCalledWith(expect.any(Object), mockConfig);
  });
});
