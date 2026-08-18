import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Funding } from './funding';

describe('Funding', () => {
  let component: Funding;
  let fixture: ComponentFixture<Funding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Funding],
    }).compileComponents();

    fixture = TestBed.createComponent(Funding);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
