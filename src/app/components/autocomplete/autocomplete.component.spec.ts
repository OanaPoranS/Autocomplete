import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AutocompleteComponent } from './autocomplete.component';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { AutocompleteItem } from '../../models/autocomplete.model';

describe('AutocompleteComponent', () => {
  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;
  let inputEl: DebugElement;
  let dropdownEl: DebugElement;

  const mockData: AutocompleteItem[] = [
    { userId: 1, id: 1, title: 'Test Item 1', completed: false },
    { userId: 1, id: 2, title: 'Test Item 2', completed: false },
    { userId: 1, id: 3, title: 'Another Test Item', completed: false }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AutocompleteComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    component.data = mockData;

    fixture.detectChanges();

    inputEl = fixture.debugElement.query(By.css('input'));
    dropdownEl = fixture.debugElement.query(By.css('ul'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an input element', () => {
    expect(inputEl).toBeTruthy();
  });

  it('should open the dropdown when input is focused', fakeAsync(() => {
    inputEl.triggerEventHandler('focus', null);
    fixture.detectChanges();
    tick();
    expect(component.isDropdownOpen()).toBeTrue();
  }));

  it('should close the dropdown when input is blurred', fakeAsync(() => {
    inputEl.triggerEventHandler('focus', null);
    fixture.detectChanges();
    inputEl.triggerEventHandler('blur', null);
    tick(100); // wait for the setTimeout delay
    fixture.detectChanges();
    expect(component.isDropdownOpen()).toBeFalse();
  }));

  it('should reset the selection index when filtering', fakeAsync(() => {
    component.inputControl.setValue('Test');
    fixture.detectChanges();
    tick();
    expect(component.currentSelectionIndex()).toBe(-1);
  }));

  it('should close the dropdown on Escape key', fakeAsync(() => {
    inputEl.triggerEventHandler('focus', null);
    fixture.detectChanges();
    tick();

    const eventEscape = new KeyboardEvent('keydown', { key: 'Escape' });
    inputEl.nativeElement.dispatchEvent(eventEscape);
    fixture.detectChanges();
    tick();
    expect(component.isDropdownOpen()).toBeFalse();
  }));

  it('should not filter if input value is empty', fakeAsync(() => {
    component.inputControl.setValue('');
    fixture.detectChanges();
    tick();
    expect(component.filteredData().length).toBe(component.data.length);
  }));
});
