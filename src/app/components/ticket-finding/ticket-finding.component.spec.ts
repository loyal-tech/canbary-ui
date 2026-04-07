import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TicketFindingComponent } from "./ticket-finding.component";

describe("TicketFindingComponent", () => {
  let component: TicketFindingComponent;
  let fixture: ComponentFixture<TicketFindingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketFindingComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketFindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
