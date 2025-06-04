import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyListborrowComponent } from './my-listborrow.component';

describe('MyListborrowComponent', () => {
  let component: MyListborrowComponent;
  let fixture: ComponentFixture<MyListborrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyListborrowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyListborrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
