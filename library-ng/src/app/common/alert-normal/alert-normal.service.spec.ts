import { TestBed } from '@angular/core/testing';
import { AlertNormal } from './alert-normal.service';

describe('AlertNormal', () => {
  let service: AlertNormal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertNormal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
