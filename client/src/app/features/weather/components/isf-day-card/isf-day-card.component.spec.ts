import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IWeatherDaily } from '../../../../core/types/weather.types';
import { IsfDayCardComponent } from './isf-day-card.component';

describe('IsfDayCardComponent', () => {
  let component: IsfDayCardComponent;
  let fixture: ComponentFixture<IsfDayCardComponent>;

  const mockDay: IWeatherDaily = {
    date: '2026-11-10',
    tempMax: 10,
    tempMin: 5,
    weatherCode: 3,
    precipitationSum: 0,
    uvIndexMax: 2,
    sunrise: '2026-11-10T07:00:00',
    sunset: '2026-11-10T17:00:00',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsfDayCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IsfDayCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('day', mockDay);
    fixture.componentRef.setInput('isSelected', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit daySelected event when clicked', () => {
    const emitSpy = vi.spyOn(component.daySelected, 'emit');

    const cardElement = fixture.nativeElement.querySelector('mat-card');
    cardElement.click();

    expect(emitSpy).toHaveBeenCalledWith(mockDay);
  });

  it('should apply selected class when isSelected is true', () => {
    fixture.componentRef.setInput('isSelected', true);
    fixture.detectChanges();

    const cardElement = fixture.nativeElement.querySelector('mat-card');
    expect(cardElement.classList.contains('selected')).toBe(true);
  });
});
