import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AcctProfileListComponent } from "./acct-profile-list.component";

describe("AcctProfileListComponent", () => {
  let component: AcctProfileListComponent;
  let fixture: ComponentFixture<AcctProfileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcctProfileListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctProfileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
