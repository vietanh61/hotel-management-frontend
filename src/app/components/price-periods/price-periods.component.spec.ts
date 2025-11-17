import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePeriodsComponent } from './price-periods.component';

describe('PricePeriodsComponent', () => {
  let component: PricePeriodsComponent;
  let fixture: ComponentFixture<PricePeriodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricePeriodsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricePeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
