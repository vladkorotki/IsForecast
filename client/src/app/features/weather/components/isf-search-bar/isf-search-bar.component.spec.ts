import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IsfSearchBarComponent } from './isf-search-bar.component';

type TestableSearchBarComponent = IsfSearchBarComponent & {
  searchControl: { setValue: (val: string) => void };
  onSearch: (event: Event) => void;
};

describe('IsfSearchBarComponent', () => {
  let component: IsfSearchBarComponent;
  let testableComponent: TestableSearchBarComponent;
  let fixture: ComponentFixture<IsfSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsfSearchBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IsfSearchBarComponent);
    component = fixture.componentInstance;
    testableComponent = component as unknown as TestableSearchBarComponent;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not emit if search query is empty or only spaces', () => {
    const emitSpy = vi.spyOn(component.searchLocation, 'emit');
    const mockEvent = { stopPropagation: vi.fn() } as unknown as Event;

    testableComponent.searchControl.setValue('   ');
    testableComponent.onSearch(mockEvent);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit trimmed query and stop propagation on search', () => {
    const emitSpy = vi.spyOn(component.searchLocation, 'emit');
    const mockEvent = { stopPropagation: vi.fn() } as unknown as Event;

    testableComponent.searchControl.setValue('  London  ');
    testableComponent.onSearch(mockEvent);

    expect(emitSpy).toHaveBeenCalledWith('London');
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should emit query on search if text is entered', () => {
    const emitSpy = vi.spyOn(component.searchLocation, 'emit');

    const testableComponent = component as unknown as {
      searchControl: { setValue: (v: string) => void };
      onSearch: (e: Event) => void;
    };

    testableComponent.searchControl.setValue('London');

    const mockEvent = { stopPropagation: vi.fn() } as unknown as Event;
    testableComponent.onSearch(mockEvent);

    expect(emitSpy).toHaveBeenCalledWith('London');
  });
});
