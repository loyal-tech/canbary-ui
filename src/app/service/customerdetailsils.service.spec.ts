import { TestBed } from '@angular/core/testing';

import { CustomerdetailsilsService } from './customerdetailsils.service';

describe('CustomerdetailsilsService', () => {
  let service: CustomerdetailsilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerdetailsilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
