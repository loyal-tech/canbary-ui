import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CustTaskAuditComponent } from "./cust-task-audit.component";


describe("CustTaskAuditComponent", () => {
    let component: CustTaskAuditComponent;
    let fixture: ComponentFixture<CustTaskAuditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CustTaskAuditComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustTaskAuditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
