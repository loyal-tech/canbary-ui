import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResolutionTaskMasterComponent } from './resolution-task-master.component';


describe('ResolutionTaskMasterComponent', () => {
  let component: ResolutionTaskMasterComponent;
  let fixture: ComponentFixture<ResolutionTaskMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResolutionTaskMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolutionTaskMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
