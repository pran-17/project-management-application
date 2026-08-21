import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchDetails } from './research-details';

describe('ResearchDetails', () => {
  let component: ResearchDetails;
  let fixture: ComponentFixture<ResearchDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResearchDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(ResearchDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
