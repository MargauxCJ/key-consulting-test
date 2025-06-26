import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Department} from '../models/department.model';

@Injectable({
  providedIn: 'root'
})
export class GeoStore {
  private selectedDepartmentSubject = new BehaviorSubject<Department | null>(null);
  selectedDepartment$ = this.selectedDepartmentSubject.asObservable();

  setSelectedDepartment(dept: Department): void {
    this.selectedDepartmentSubject.next(dept);
  }

  // Not used in this exercice, but usefull nowaday
  clearSelectedDepartment(): void {
    this.selectedDepartmentSubject.next(null);
  }
}
