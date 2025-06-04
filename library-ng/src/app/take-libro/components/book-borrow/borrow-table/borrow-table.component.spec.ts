import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowTableComponent } from './borrow-table.component';

describe('BorrowTableComponent', () => {
  let component: BorrowTableComponent;
  let fixture: ComponentFixture<BorrowTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BorrowTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BorrowTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
