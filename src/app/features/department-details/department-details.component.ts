import {Component, Input, OnChanges, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {GeoService} from '../../core/services/geo.service';
import {Town} from '../../core/models/town.model';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';

@Component({
  selector: 'app-department-details',
  standalone: true,
  imports: [
    MatTable,
    MatHeaderCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRowDef,
    MatRow,
    MatPaginator,
    MatSort,
    MatSortHeader,
  ],
  templateUrl: './department-details.component.html',
  styleUrl: './department-details.component.scss'
})
export class DepartmentDetailsComponent implements OnChanges{
  @Input() departmentCode: string;
  towns$: Observable<Town[]>;
  dataSource = new MatTableDataSource<Town>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['nom', 'code', 'siren', 'population', 'codeRegion', 'codePostaux'];

  constructor(private geoService: GeoService) {

  }

  public ngOnChanges(): void {
    this.towns$ = this.geoService.getCommunesByDepartment(this.departmentCode);
    this.towns$.subscribe((towns: Town[]) => {
      this.dataSource.data = towns;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
