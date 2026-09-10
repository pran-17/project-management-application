import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchFunding } from './research-funding';

describe('ResearchFunding', () => {
  let component: ResearchFunding;
  let fixture: ComponentFixture<ResearchFunding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResearchFunding],
    }).compileComponents();

    fixture = TestBed.createComponent(ResearchFunding);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
