import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
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
import {Department} from '../../core/models/department.model';
import {GeoStore} from '../../core/stores/geo.store';
import {filter, switchMap} from 'rxjs';

@Component({
  selector: 'app-department-details',
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
  ],
  templateUrl: './department-details.component.html',
  standalone: true,
  styleUrl: './department-details.component.scss'
})
export class DepartmentDetailsComponent implements OnInit{
  @ViewChild(MatPaginator, {}) public paginator: MatPaginator;
  @ViewChild(MatSort, {}) public sort: MatSort;
  public dataSource = new MatTableDataSource<Town>();
  public departmentName: string;
  public displayedColumns: string[] = ['code', 'nom', 'siren', 'codeEpci', 'codesPostaux'];

  constructor(
    private geoService: GeoService,
    private geoStore: GeoStore,
    private cdr: ChangeDetectorRef
  ) {
  }

  public ngOnInit(): void {
    this.geoStore.selectedDepartment$.pipe(
      filter((department): department is Department => !!department),
      switchMap((department: Department) => {
        this.departmentName = department.nom;
        return this.geoService.getTownsByDepartment(department.code)
      })
    ).subscribe(towns => {
      this.dataSource.data = towns;
      this.cdr.detectChanges();

      if (this.paginator && this.sort && towns) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }
}
