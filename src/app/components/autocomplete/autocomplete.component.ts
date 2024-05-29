import { Component, OnInit, signal, effect } from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { NgForOf, NgIf } from "@angular/common";
import { AutocompleteItem } from "../../models/autocomplete.model";
import { AutocompleteDataService } from "../../services/autocomplete-data.service";
import {take} from "rxjs";


@Component({
  selector: 'autocomplete',
  standalone: true,
  imports: [NgForOf, NgIf, ReactiveFormsModule],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css'
})

export class AutocompleteComponent implements OnInit{
  data = signal<AutocompleteItem[]>([]);
  filteredData = signal<AutocompleteItem[]>([]);
  inputControl = new FormControl();
  isDropdownOpen = signal<boolean>(false);
  currentSelectionIndex = signal<number>(-1);
  error = signal<string | null>( null);
  constructor(private autocompleteDataService: AutocompleteDataService) {}


 ngOnInit() {
   this.getAutocompleteData();
 }


 getAutocompleteData() {
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

  selectItem(item: AutocompleteItem) {
    console.log('item', item);
  }
}
