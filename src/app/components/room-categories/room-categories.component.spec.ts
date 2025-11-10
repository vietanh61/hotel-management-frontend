import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomCategoriesComponent } from './room-categories.component';

describe('RoomCategoriesComponent', () => {
  let component: RoomCategoriesComponent;
  let fixture: ComponentFixture<RoomCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomCategoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
