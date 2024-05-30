import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AutocompleteDataService } from './autocomplete-data.service';
import { AutocompleteItem } from '../models/autocomplete.model';
import { of } from 'rxjs';

describe('AutocompleteDataService', () => {
  let service: AutocompleteDataService;
  let httpMock: HttpTestingController;

  const mockData: AutocompleteItem[] = [
    { userId: 1, id: 1, title: 'Test Item 1', completed: false },
    { userId: 1, id: 2, title: 'Test Item 2', completed: false },
    { userId: 1, id: 3, title: 'Another Test Item', completed: false }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AutocompleteDataService]
    });
    service = TestBed.inject(AutocompleteDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected data (HttpClient called once)', () => {
    service.getAutocompleteData().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/todos');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should handle error and return empty array', () => {
    spyOn(service, 'getAutocompleteData').and.returnValue(of([]));

    service.getAutocompleteData().subscribe(data => {
      expect(data).toEqual([]);
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/todos');
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('network error'));
  });
});
