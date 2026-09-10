import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignGuide } from './assign-guide';

describe('AssignGuide', () => {
  let component: AssignGuide;
  let fixture: ComponentFixture<AssignGuide>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignGuide],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignGuide);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
