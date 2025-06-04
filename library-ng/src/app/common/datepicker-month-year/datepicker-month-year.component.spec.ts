import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DatepickerMonthYearComponent } from "./datepicker-month-year.component";

describe("DatepickerMonthYearComponent", () => {
  let component: DatepickerMonthYearComponent;
  let fixture: ComponentFixture<DatepickerMonthYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatepickerMonthYearComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatepickerMonthYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
