import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTableComponent } from './profile-table.component';

describe('ProfileTableComponent', () => {
  let component: ProfileTableComponent;
  let fixture: ComponentFixture<ProfileTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
