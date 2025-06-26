import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionSearchComponent } from './region-search.component';

describe('RegionSearchComponent', () => {
  let component: RegionSearchComponent;
  let fixture: ComponentFixture<RegionSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegionSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
