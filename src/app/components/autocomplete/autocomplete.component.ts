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

   this.inputControl.valueChanges.pipe(
     take(1)
   ).subscribe({
     next: (value) => {
       this.filteredData.set(this._filter(value || ''));
     }
   });

   effect(() => {
     console.log('Filtered data chaged', this.filteredData());
   });
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

  private _filter(value: string): AutocompleteItem[] {
    const filterValue = value.toLowerCase();
    return this.data().filter(item => item.title.toLowerCase().includes(filterValue));
  }

  onInputFocus(): void {
    this.isDropdownOpen.set(true);
  }


  selectItem(item: AutocompleteItem): void {
    console.log('item', item);
  }
}
