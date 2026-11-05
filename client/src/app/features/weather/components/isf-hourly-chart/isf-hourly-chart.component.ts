import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, input, viewChild } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';

@Component({
  imports: [CommonModule],
  selector: 'isf-hourly-chart',
  templateUrl: './isf-hourly-chart.component.html',
  styleUrl: './isf-hourly-chart.component.scss',
})
export class IsfHourlyChartComponent implements AfterViewInit {
  readonly config = input.required<ChartConfiguration>();
  private chartCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('chartCanvas');
  private chartInstance: Chart | null = null;

  ngAfterViewInit(): void {
    const ctx = this.chartCanvas().nativeElement.getContext('2d');
    if (!ctx) return;
    this.chartInstance = new Chart(ctx, this.config());
  }
}
