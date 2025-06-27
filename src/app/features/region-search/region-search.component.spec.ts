import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick, flush } from '@angular/core/testing';
import { RegionSearchComponent } from './region-search.component';
import { GeoService } from '../../core/services/geo.service';
import { of } from 'rxjs';
import { Region } from '../../core/models/region.model';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('RegionSearchComponent just filteredRegionList$', () => {
  let component: RegionSearchComponent;
  let fixture: ComponentFixture<RegionSearchComponent>;
  let geoServiceMock: Partial<GeoService>;

  const mockRegions: Region[] = [
    { code: '28', nom: 'Normandie' },
    { code: '02', nom: 'Martinique' },
  ];

  beforeEach(waitForAsync(() => {
    geoServiceMock = {
      getRegions: jest.fn(() => of(mockRegions)),
    };

    TestBed.configureTestingModule({
      imports: [RegionSearchComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [{ provide: GeoService, useValue: geoServiceMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // unsubscribe and flush to clean timer, because of debounce time
  function setValueAndGetFilteredResult(value: string, tickTime = 300): Region[] {
    let result: Region[] = [];
    const sub = component.filteredRegionList$.subscribe((filtered: Region[]) => result = filtered);

    component.geoForm.controls.region.setValue(value);
    tick(tickTime);
    sub.unsubscribe();
    flush();

    return result;
  }

  it('should filter regions (regionFormControl)', fakeAsync(() => {
    const result = setValueAndGetFilteredResult('norma');
    expect(result.length).toBe(1);
    expect(result[0].nom).toBe('Normandie');
  }));

  it('should return all regions if input is empty', fakeAsync(() => {
    const result = setValueAndGetFilteredResult('');
    expect(result.length).toBe(mockRegions.length);
  }));
});
