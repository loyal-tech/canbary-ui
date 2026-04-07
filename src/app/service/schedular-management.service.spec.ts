/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SchedularManagementService } from './schedular-management.service';

describe('Service: SchedularManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SchedularManagementService]
    });
  });

  it('should ...', inject([SchedularManagementService], (service: SchedularManagementService) => {
    expect(service).toBeTruthy();
  }));
});
