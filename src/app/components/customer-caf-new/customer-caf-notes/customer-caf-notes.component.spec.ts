/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomerCafNotesComponent } from "./customer-caf-notes.component";

describe("CustomerCafNotesComponent", () => {
  let component: CustomerCafNotesComponent;
  let fixture: ComponentFixture<CustomerCafNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerCafNotesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCafNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
