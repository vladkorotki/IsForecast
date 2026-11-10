import { ElementRef } from '@angular/core';
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

    const mockContext = {
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn(),
      putImageData: vi.fn(),
      createImageData: vi.fn(),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      transform: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
    };

    canvas.getContext = vi.fn().mockReturnValue(mockContext);

    const viewChildRef = component as unknown as {
      chartCanvas: () => ElementRef<HTMLCanvasElement>;
    };
    vi.spyOn(viewChildRef, 'chartCanvas').mockReturnValue({
      nativeElement: canvas,
    } as ElementRef<HTMLCanvasElement>);

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
