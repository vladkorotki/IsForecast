import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isfPressure',
})
export class IsfPressurePipe implements PipeTransform {
  transform(hPa: number, unit: 'hPa' | 'mmHg' = 'mmHg'): string {
    if (unit === 'mmHg') {
      const mmHg = hPa * 0.75006;
      return `${mmHg.toFixed(0)} mmHg`;
    }
    return `${hPa.toFixed(0)} hPa`;
  }
}
