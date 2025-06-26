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
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {DepartmentDetailsComponent} from '../department-details/department-details.component';

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
    MatCard,
    MatCardContent,
    MatIcon,
    MatIconButton,
    DepartmentDetailsComponent
  ],
  templateUrl: './region-search.component.html',
  styleUrl: './region-search.component.scss'
})
export class RegionSearchComponent implements OnInit {
  public regionFormControl = new FormControl<Region|string>('');
  public departmentFormControl = new FormControl<Department>(null);
  public filteredRegionList$: Observable<Region[]>;
  public departments$: Observable<Department[]>;
  public departmentCode: string;
  public allRegions$: Observable<Region[]>;

  constructor(private geoService: GeoService) {
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

  public displayDepartments(): void {
    this.departments$ = typeof this.regionFormControl.value === 'string' ?  null : this.geoService.getDepartmentsByRegion(this.regionFormControl.value.code);
  }

  onDepartmentChange(event: MatSelectionListChange): void {
    const selected = event.options[0]?.value;
    if (selected) {
      this.departmentCode = selected.code;
    }
  }
}
