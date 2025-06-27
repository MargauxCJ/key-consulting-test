import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GeoService } from './geo.service';
import { Region } from '../models/region.model';
import { Department } from '../models/department.model';
import { Town } from '../models/town.model';

describe('GeoService', () => {
  let service: GeoService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://geo.api.gouv.fr';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GeoService]
    });
    service = TestBed.inject(GeoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get regions', () => {
    const mockRegions: Region[] = [
      { code: '28', nom: 'Normandie' },
      { code: '02', nom: 'Martinique' }
    ];

    service.getRegions().subscribe((regions: Region[]) => {
      expect(regions).toEqual(mockRegions);
    });

    const req = httpMock.expectOne(`${apiUrl}/regions`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRegions);
  });

  it('should get departements by region code', () => {
    const mockDepartments: Department[] = [
      { code: '14', nom: 'Calvados', codeRegion: '28' },
      { code: '50', nom: 'Manche', codeRegion: '28' }
    ];

    service.getDepartmentsByRegion('28').subscribe((departments) => {
      expect(departments).toEqual(mockDepartments);
    });

    const req = httpMock.expectOne(`${apiUrl}/regions/28/departements`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDepartments);
  });

  it('should fetch communes by departement code', () => {
    const mockTowns: Town[] = [
      {
        nom: "Caen",
        code: "14118",
        codeDepartement: "14",
        siren: "211401187",
        codeEpci: "200065597",
        codeRegion: "28",
        codesPostaux: [
          "14000"
        ],
        population: 108398
      },
      {
        nom: "Caumont-sur-Aure",
        code: "14143",
        codeDepartement: "14",
        siren: "200064871",
        codeEpci: "200069524",
        codeRegion: "28",
        codesPostaux: [
          "14240"
        ],
        population: 2439
      },
    ];

    const departmentCode= '14';

    service.getTownsByDepartment(departmentCode).subscribe((towns) => {
      expect(towns).toEqual(mockTowns);
    });

    const req = httpMock.expectOne(`${apiUrl}/departements/${departmentCode}/communes`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTowns);
  });
});
