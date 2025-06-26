import {Component, OnInit} from '@angular/core';
import {GeoService} from '../../core/services/geo.service';
import {combineLatest, debounceTime, map, Observable, startWith} from 'rxjs';
import {Region} from '../../core/models/region.model';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatInput} from '@angular/material/input';
import {AsyncPipe} from '@angular/common';
import {Department} from '../../core/models/department.model';
import {MatListOption, MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import {DepartmentDetailsComponent} from '../department-details/department-details.component';
import {MatCard, MatCardContent} from '@angular/material/card';
import {GeoStore} from '../../core/stores/geo.store';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-region-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatLabel,
    MatInput,
    AsyncPipe,
    MatSelectionList,
    MatListOption,
    DepartmentDetailsComponent,
    MatCard,
    MatCardContent,
    MatIcon
  ],
  templateUrl: './region-search.component.html',
  styleUrl: './region-search.component.scss'
})
export class RegionSearchComponent implements OnInit {
  public regionFormControl = new FormControl<Region|string>('');
  public departmentFormControl = new FormControl<Department>(null);
  public filteredRegionList$: Observable<Region[]>;
  public departments$: Observable<Department[]>;
  public allRegions$: Observable<Region[]>;

  constructor(
    private geoService: GeoService,
    private geoStore: GeoStore,
    ) {
    this.allRegions$ = this.geoService.getRegions();
  }

  ngOnInit(): void {
    this.filteredRegionList$ = combineLatest([
      this.regionFormControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300)
      ),
      this.allRegions$
    ]).pipe(
      map(([value, regions]) => {
        this.departmentFormControl.reset();
        const searchValue = (typeof value === 'string' ? value : value?.nom || '').toLowerCase();
        return regions.filter(option =>
          option.nom.toLowerCase().includes(searchValue) ||
          option.code.toLowerCase().includes(searchValue)
        );
      })
    );
  }

  public displayRegion(region?: Region): string {
    return region ? region.nom : '';
  }

  public getDepartmentsFromRegionSelected(): void {
    this.departments$ = typeof this.regionFormControl.value === 'string' ?  null : this.geoService.getDepartmentsByRegion(this.regionFormControl.value.code);
  }

  public onDepartmentChange(event: MatSelectionListChange): void {
    const selected = event.options[0]?.value;
    if (selected) {
      this.geoStore.setSelectedDepartment(selected);
    }
  }
}
