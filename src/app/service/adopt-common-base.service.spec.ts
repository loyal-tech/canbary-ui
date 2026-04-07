import { TestBed } from '@angular/core/testing';

import { AdoptCommonBaseService } from './adopt-common-base.service';

describe('AdoptCommonBaseServiceService', () => {
  let service: AdoptCommonBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdoptCommonBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
