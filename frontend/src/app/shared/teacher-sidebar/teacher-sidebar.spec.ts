import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherSidebar } from './teacher-sidebar';

describe('TeacherSidebar', () => {
  let component: TeacherSidebar;
  let fixture: ComponentFixture<TeacherSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherSidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
