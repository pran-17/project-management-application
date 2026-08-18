import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Research } from './research';

describe('Research', () => {
  let component: Research;
  let fixture: ComponentFixture<Research>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Research],
    }).compileComponents();

    fixture = TestBed.createComponent(Research);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
