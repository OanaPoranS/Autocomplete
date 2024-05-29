import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, of} from "rxjs";
import {AutocompleteItem} from "../models/autocomplete.model";

@Injectable({
  providedIn: 'root'
})

export class AutocompleteDataService {
  private url = 'https://jsonplaceholder.typicode.com/todos';

  constructor(private http: HttpClient) {
  }

  getAutocompleteData(): Observable<AutocompleteItem[]> {
    return this.http.get<AutocompleteItem[]>(this.url).pipe(
      catchError((error) => of(<AutocompleteItem[]>[]))
    )
  }
}
