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
     console.log('Filtered data changed', this.filteredData());
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

  onInputBlur(): void {
    setTimeout(()=> this.isDropdownOpen.set(false), 100);//delay to allow lick event to fire
  }

  onKeyDown(event: KeyboardEvent): void {
    if(this.isDropdownOpen()) {
      switch (event.key) {
        case 'ArrowDown':
          this.currentSelectionIndex.set((this.currentSelectionIndex() + 1) % this.filteredData().length);
          break;
        case 'ArrowUp':
          this.currentSelectionIndex.set((this.currentSelectionIndex() - 1 + this.filteredData().length) % this.filteredData().length);
          break;
        case 'Enter':
          if (this.currentSelectionIndex() >= 0 && this.currentSelectionIndex() < this.filteredData().length) {
            this.selectItem(this.filteredData()[this.currentSelectionIndex()]);
          }
          break;
          case 'Escape':
            this.isDropdownOpen.set(false);
            break;
      }
    } else if ( event.key === 'ArrowDown') {
      this.isDropdownOpen.set(true);
    }
  }


  selectItem(item: AutocompleteItem): void {
    console.log('item', item);
  }
}
