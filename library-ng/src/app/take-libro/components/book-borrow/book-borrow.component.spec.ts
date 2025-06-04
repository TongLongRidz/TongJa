import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookBorrowComponent } from './book-borrow.component';

describe('BookBorrowComponent', () => {
  let component: BookBorrowComponent;
  let fixture: ComponentFixture<BookBorrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookBorrowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookBorrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
