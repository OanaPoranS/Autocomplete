import {Component, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AutocompleteComponent} from "./components/autocomplete/autocomplete.component";
import {take} from "rxjs";
import {AutocompleteDataService} from "./services/autocomplete-data.service";
import {AutocompleteItem} from "./models/autocomplete.model";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AutocompleteComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Autocomplete with Angular';
  data = signal<AutocompleteItem[]>([]);
  filteredData = signal<AutocompleteItem[]>([]);
  error = signal<string | null>(null);

  constructor(private autocompleteDataService: AutocompleteDataService) {}

  ngOnInit() {
    this.getAutocompleteData();
  }

  getAutocompleteData(): void {
    this.autocompleteDataService.getAutocompleteData().pipe((take(1))).subscribe({
      next: (data) => {
        this.data.set(data);
        this.filteredData.set(data);
      },
      error: (err) => {
        this.error.set(`'Failed to fetch data, error:' ${err}`);
      }
    });
  }
}
