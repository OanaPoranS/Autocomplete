import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AutocompleteDataService } from './services/autocomplete-data.service';
import { of, throwError } from 'rxjs';
import { AutocompleteItem } from './models/autocomplete.model';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockAutocompleteDataService: jasmine.SpyObj<AutocompleteDataService>;

  const mockData: AutocompleteItem[] = [
    { userId: 1, id: 1, title: 'Test Item 1', completed: false },
    { userId: 1, id: 2, title: 'Test Item 2', completed: false },
    { userId: 1, id: 3, title: 'Another Test Item', completed: false }
  ];

  beforeEach(async () => {
    mockAutocompleteDataService = jasmine.createSpyObj('AutocompleteDataService', ['getAutocompleteData']);
    mockAutocompleteDataService.getAutocompleteData.and.returnValue(of(mockData));

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: AutocompleteDataService, useValue: mockAutocompleteDataService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the title 'Autocomplete with Angular'`, () => {
    expect(component.title).toEqual('Autocomplete with Angular');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Autocomplete with Angular');
  });

  it('should fetch autocomplete data on init', () => {
    expect(mockAutocompleteDataService.getAutocompleteData).toHaveBeenCalled();
    expect(component.data()).toEqual(mockData);
    expect(component.filteredData()).toEqual(mockData);
  });

  it('should pass data to AutocompleteComponent', () => {
    const autocompleteComponent = fixture.debugElement.query(By.css('autocomplete')).componentInstance;
    expect(autocompleteComponent.data).toEqual(mockData);
  });
});
