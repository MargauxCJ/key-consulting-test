import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Department} from '../models/department.model';
import {Region} from '../models/region.model';
import {Town} from '../models/town.model';

@Injectable({
  providedIn: 'root'
})
export class GeoService {
  private apiUrl = 'https://geo.api.gouv.fr';

  constructor(private http: HttpClient) {}

  getRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.apiUrl}/regions`);
  }

  getRegionByName(nom: string): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.apiUrl}/regions?nom=${nom}`);
  }

  getDepartmentsByRegion(codeRegion: string): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/regions/${codeRegion}/departements`);
  }

  getTownsByDepartment(codeDepartment: string): Observable<Town[]> {
    return this.http.get<Town[]>(`${this.apiUrl}/departements/${codeDepartment}/communes`);
  }
}
