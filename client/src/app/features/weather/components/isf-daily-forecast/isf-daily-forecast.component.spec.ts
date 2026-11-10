import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IWeatherDaily } from '../../../../core/types/weather.types';
import { IsfDailyForecastComponent } from './isf-daily-forecast.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

type TestableDailyForecastComponent = IsfDailyForecastComponent & {
  selectDay: (index: number) => void;
  selectedIndex: () => number;
  selectedDay: () => IWeatherDaily;
};

describe('IsfDailyForecastComponent', () => {
  let component: IsfDailyForecastComponent;
  let testableComponent: TestableDailyForecastComponent;
  let fixture: ComponentFixture<IsfDailyForecastComponent>;

  const mockDaily: IWeatherDaily[] = [
    {
      date: '2026-11-10',
      tempMax: 10,
      tempMin: 5,
      weatherCode: 3,
      precipitationSum: 0,
      uvIndexMax: 2,
      sunrise: '2026-11-10T07:00:00',
      sunset: '2026-11-10T17:00:00',
    },
    {
      date: '2026-11-11',
      tempMax: 12,
      tempMin: 7,
      weatherCode: 1,
      precipitationSum: 0,
      uvIndexMax: 3,
      sunrise: '2026-11-11T07:00:00',
      sunset: '2026-11-11T17:00:00',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsfDailyForecastComponent],
      schemas: [NO_ERRORS_SCHEMA], // <-- Отключаем ошибки о неизвестных тегах
    }).compileComponents();

    fixture = TestBed.createComponent(IsfDailyForecastComponent);
    component = fixture.componentInstance;
    testableComponent = component as unknown as TestableDailyForecastComponent;

    fixture.componentRef.setInput('daily', mockDaily);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with selectedIndex 0 and selectedDay as the first item', () => {
    expect(testableComponent.selectedIndex()).toBe(0);
    expect(testableComponent.selectedDay()).toEqual(mockDaily[0]);
  });

  it('should update selectedIndex and emit event on selectDay', () => {
    const emitSpy = vi.spyOn(component.selectedDayChange, 'emit');

    testableComponent.selectDay(1);

    expect(testableComponent.selectedIndex()).toBe(1);
    expect(testableComponent.selectedDay()).toEqual(mockDaily[1]);
    expect(emitSpy).toHaveBeenCalledWith(mockDaily[1]);
  });

  it('should update selected index and emit day on selectDay', () => {
    const emitSpy = vi.spyOn(component.selectedDayChange, 'emit');

    // Доступ к protected методу
    const testableComponent = component as unknown as { selectDay: (i: number) => void };
    testableComponent.selectDay(1); // Выбираем второй день

    // Проверяем, что selectedIndex обновился (он protected, достаем через сигнал)
    const signals = component as unknown as { selectedIndex: () => number };
    expect(signals.selectedIndex()).toBe(1);

    // Проверяем, что эмитнулся правильный день
    expect(emitSpy).toHaveBeenCalledWith(mockDaily[1]);
  });
});
