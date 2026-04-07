import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MvnoComponent } from './mvno.component';

describe('MvnoComponent', () => {
  let component: MvnoComponent;
  let fixture: ComponentFixture<MvnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MvnoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MvnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
