import { ComponentFixture, TestBed } from "@angular/core/testing";
import { JunkEmailComponent } from "./junk-email.component";

describe("TicketReasonCategoryComponent", () => {
  let component: JunkEmailComponent;
  let fixture: ComponentFixture<JunkEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JunkEmailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JunkEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
