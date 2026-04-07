import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FultyMacManagementComponent } from './fulty-mac-management.component';


describe('FultyMacManagementComponent', () => {
    let component: FultyMacManagementComponent;
    let fixture: ComponentFixture<FultyMacManagementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FultyMacManagementComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FultyMacManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
