import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { IsfPressurePipe } from '../../../../core/pipes/pressure/isf-pressure-pipe';
import { IsfWeatherInfoPipe } from '../../../../core/pipes/weather-info/isf-weather-info-pipe';
import { IWeatherCurrent } from '../../../../core/types/weather.types';
import { IsfCurrentWeatherComponent } from './isf-current-weather.component';

describe('IsfCurrentWeatherComponent', () => {
  let component: IsfCurrentWeatherComponent;
  let fixture: ComponentFixture<IsfCurrentWeatherComponent>;

  // Фейковые данные, строго по интерфейсу IWeatherCurrent
  const mockWeather: IWeatherCurrent = {
    temperature: 15,
    humidity: 80,
    pressure: 1012,
    cloudCover: 50,
    uvIndex: 3,
    weatherCode: 3, // Overcast
    location: {
      name: 'Minsk',
      country: 'Belarus',
      latitude: 53.9,
      longitude: 27.5,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsfCurrentWeatherComponent, IsfPressurePipe, IsfWeatherInfoPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(IsfCurrentWeatherComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display data from input correctly', () => {
    // Передаем данные в обязательный Signal-инпут
    fixture.componentRef.setInput('current', mockWeather);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const textContent = compiled.textContent;

    // Проверяем температуру
    expect(textContent).toContain('15');

    // Проверяем влажность
    expect(textContent).toContain('80%');

    // Проверяем пайп погоды
    expect(textContent).toContain('Overcast');
  });
});
