export interface IChartDatasetConfig {
  label: string;
  data: number[];
  type: 'line' | 'bar';
  color: string;
  yAxisID: 'y' | 'y1';
  fill?: boolean;
}
