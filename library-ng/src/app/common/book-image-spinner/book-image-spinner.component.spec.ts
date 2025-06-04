import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookImageSpinnerComponent } from './book-image-spinner.component';

describe('BookImageSpinnerComponent', () => {
  let component: BookImageSpinnerComponent;
  let fixture: ComponentFixture<BookImageSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookImageSpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookImageSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
