/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ThirdPartyMenuService } from './third-party-menu.service';

describe('Service: ThirdPartyMenu', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThirdPartyMenuService]
    });
  });

  it('should ...', inject([ThirdPartyMenuService], (service: ThirdPartyMenuService) => {
    expect(service).toBeTruthy();
  }));
});
