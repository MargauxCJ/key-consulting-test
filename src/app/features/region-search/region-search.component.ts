import {Component, OnInit} from '@angular/core';
import {GeoService} from '../../core/services/geo.service';
import {combineLatest, debounceTime, map, Observable, startWith} from 'rxjs';
import {Region} from '../../core/models/region.model';
import {FormBuilder, FormControl, ReactiveFormsModule,Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
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
    MatIcon,
    MatError,
  ],
  templateUrl: './region-search.component.html',
  standalone: true,
  styleUrl: './region-search.component.scss'
})
export class RegionSearchComponent implements OnInit {
  public geoForm = this.formBuilder.group({
    region: [null as string|Region, [Validators.required]],
  });
  public departmentFormControl = new FormControl<Department>(null);
  public filteredRegionList$: Observable<Region[]>;
  public departments$: Observable<Department[]>;
  public allRegions$: Observable<Region[]>;

  constructor(
    private formBuilder: FormBuilder,
    private geoService: GeoService,
    private geoStore: GeoStore,
    ) {
    this.allRegions$ = this.geoService.getRegions();
  }

  ngOnInit(): void {
    this.filteredRegionList$ = combineLatest([
      this.geoForm.controls.region.valueChanges.pipe(
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
    const regionValue = this.geoForm.controls.region?.value;
    this.departments$ =  (regionValue && typeof regionValue !== 'string' && regionValue.code) ?
      this.geoService.getDepartmentsByRegion(regionValue.code)
      : null;
  }

  public onDepartmentChange(event: MatSelectionListChange): void {
    const selected = event.options[0]?.value;
    if (selected) {
      this.geoStore.setSelectedDepartment(selected);
    }
  }
}
