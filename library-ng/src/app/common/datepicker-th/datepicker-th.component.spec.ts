import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerThComponent } from './datepicker-th.component';

describe('DatepickerThComponent', () => {
  let component: DatepickerThComponent;
  let fixture: ComponentFixture<DatepickerThComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatepickerThComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatepickerThComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
