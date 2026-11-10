import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Chart, ChartConfiguration } from 'chart.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IsfHourlyChartComponent } from '../../components/isf-hourly-chart/isf-hourly-chart.component';

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
    fixture.componentRef.setInput('config', mockConfig);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize Chart in ngAfterViewInit', () => {
    const canvas = document.createElement('canvas');
    const mockContext = {};
    canvas.getContext = vi.fn().mockReturnValue(mockContext);

    const viewChildRef = component as unknown as {
      chartCanvas: () => ElementRef<HTMLCanvasElement>;
    };
    viewChildRef.chartCanvas = () => ({ nativeElement: canvas }) as ElementRef<HTMLCanvasElement>;

    component.ngAfterViewInit();

    expect(Chart).toHaveBeenCalledTimes(1);
    expect(Chart).toHaveBeenCalledWith(mockContext, mockConfig);
  });
});
