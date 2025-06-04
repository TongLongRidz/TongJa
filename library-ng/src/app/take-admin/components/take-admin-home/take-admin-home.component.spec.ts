import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TakeAdminHomeComponent } from "./take-admin-home.component";

describe("TakeAdminHomeComponent", () => {
  let component: TakeAdminHomeComponent;
  let fixture: ComponentFixture<TakeAdminHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TakeAdminHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TakeAdminHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
