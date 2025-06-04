import { TestBed } from '@angular/core/testing';

import { AlertConfirm } from './alert-confirm.service';

describe('AlertConfirm', () => {
  let service: AlertConfirm;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertConfirm);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
