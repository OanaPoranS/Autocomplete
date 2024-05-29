import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AutocompleteComponent} from "./components/autocomplete/autocomplete.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AutocompleteComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Autocomplete with Angular';
}
