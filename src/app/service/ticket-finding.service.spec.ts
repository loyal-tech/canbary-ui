import { TestBed } from "@angular/core/testing";

import { TicketFindingService } from "./ticket-finding.service";

describe("TicketFindingService", () => {
  let service: TicketFindingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketFindingService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
