import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IsfSearchBarComponent } from './isf-search-bar.component';

describe('IsfSearchBarComponent', () => {
  let component: IsfSearchBarComponent;
  let fixture: ComponentFixture<IsfSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsfSearchBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IsfSearchBarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
