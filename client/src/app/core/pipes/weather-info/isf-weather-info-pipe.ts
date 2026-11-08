import { Pipe, PipeTransform } from '@angular/core';
import { getWeatherInfo, IWeatherInfo } from '../../utils/isf-weather-info-util';

@Pipe({
  name: 'isfWeatherInfo',
  pure: true,
})
export class IsfWeatherInfoPipe implements PipeTransform {
  transform(weatherCode: number): IWeatherInfo {
    return getWeatherInfo(weatherCode);
  }
}
