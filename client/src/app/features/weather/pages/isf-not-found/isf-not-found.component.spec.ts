import { NO_ERRORS_SCHEMA } from '@angular/core'; // <-- Правильный импорт
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IsfWeatherStateService } from '../../../../core/services/isf-weather-state.service';
import { IsfNotFoundComponent } from './isf-not-found.component';

type TestableIsfNotFoundComponent = IsfNotFoundComponent & {
  onSearch: (city: string) => void;
  goHome: () => void;
};

describe('IsfNotFoundComponent', () => {
  let component: IsfNotFoundComponent;
  let fixture: ComponentFixture<IsfNotFoundComponent>;
  let testableComponent: TestableIsfNotFoundComponent;

  let mockRouter: { navigate: ReturnType<typeof vi.fn> };
  let mockStateService: {
    resetCoords: ReturnType<typeof vi.fn>;
    setLocation: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockRouter = { navigate: vi.fn() };
    mockStateService = {
      resetCoords: vi.fn(),
      setLocation: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [IsfNotFoundComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: IsfWeatherStateService, useValue: mockStateService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(IsfNotFoundComponent);
    component = fixture.componentInstance;
    testableComponent = component as unknown as TestableIsfNotFoundComponent;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset coords, set location, and navigate home on search', () => {
    testableComponent.onSearch('London');

    expect(mockStateService.resetCoords).toHaveBeenCalled();
    expect(mockStateService.setLocation).toHaveBeenCalledWith('London');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should clear location and navigate home on goHome', () => {
    testableComponent.goHome();

    expect(mockStateService.setLocation).toHaveBeenCalledWith(null);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
