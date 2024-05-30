import {Component, OnInit, signal, OnDestroy, Input, ElementRef} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NgForOf, NgIf} from "@angular/common";
import {Subject, take, takeUntil} from "rxjs";
import {AutocompleteItem} from "../../models/autocomplete.model";

@Component({
  selector: 'autocomplete',
  standalone: true,
  imports: [NgForOf, NgIf, ReactiveFormsModule],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css'
})

export class AutocompleteComponent implements OnInit, OnDestroy {
  @Input() data: AutocompleteItem[] = [];

  filteredData = signal<AutocompleteItem[]>([]);
  inputControl = new FormControl();
  isDropdownOpen = signal<boolean>(false);
  currentSelectionIndex = signal<number>(-1);
  private destroy$ = new Subject<void>();

  constructor(private elementRef: ElementRef) {}
  ngOnInit() {
    this.inputControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.filteredData.set(this._filter(value || ''));
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private _filter(value: string): AutocompleteItem[] {
    const filterValue = value.toLowerCase();
    return this.data.filter(item => item.title.toLowerCase().includes(filterValue));
  }

  onInputFocus(): void {
    this.isDropdownOpen.set(true);
  }

  onInputBlur(): void {
    setTimeout(() => this.isDropdownOpen.set(false), 100);//delay to allow lick event to fire
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.isDropdownOpen()) {
      switch (event.key) {
        case 'ArrowDown':
          this.currentSelectionIndex.set((this.currentSelectionIndex() + 1) % this.filteredData().length);
          this.scrollIntoView();
          console.log('ArrowDown', (this.currentSelectionIndex() + 1) % this.filteredData().length);
          break;
        case 'ArrowUp':
          this.currentSelectionIndex.set((this.currentSelectionIndex() - 1 + this.filteredData().length) % this.filteredData().length);
          this.scrollIntoView();
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
    } else if (event.key === 'ArrowDown') {
      this.isDropdownOpen.set(true);
    }
  }

  //scrollIntoView is ugly, since we are not using a virtual scroll, this is a workaround to scroll to the selected item with the keyboard
  scrollIntoView() {
    const listElement = this.elementRef.nativeElement.querySelector('ul');
    const itemElement = listElement.children[this.currentSelectionIndex()];
    itemElement.scrollIntoView({ block: 'nearest' });
  }

  selectItem(item: AutocompleteItem): void {
    this.inputControl.setValue(item.title);
    this.isDropdownOpen.set(false);
  }
}
