import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubAreaManagementComponent } from './subArea-management.component';


describe('CountryManagementComponent', () => {
  let component: SubAreaManagementComponent;
  let fixture: ComponentFixture<SubAreaManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubAreaManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAreaManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
