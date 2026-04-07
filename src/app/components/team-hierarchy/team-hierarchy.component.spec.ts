import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamHierarchyComponent } from './team-hierarchy.component';

describe('TeamHierarchyComponent', () => {
  let component: TeamHierarchyComponent;
  let fixture: ComponentFixture<TeamHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamHierarchyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
