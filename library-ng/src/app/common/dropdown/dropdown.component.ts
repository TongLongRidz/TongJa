import { Component, ElementRef,EventEmitter, HostListener, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent  implements OnInit {

  @Input() options: { value: string; label: string }[] = []; 
  @Input() placeholder: string = '';
  @Output() selectionChange = new EventEmitter<{ value: string; label: string }>();
  @Input() formControlName: string = ''; 
  @Input() height: string = '35px';
  @Input() formControl!: FormControl | null;

  isDropdownOpen = false; 
  selectedOption: { value: string; label: string } | null = null; 
  isSmall = true; 

  elementRef = inject(ElementRef); 
  ngOnInit() {
    this.formControl?.valueChanges.subscribe(value => {
      this.selectedOption = this.options.find(option => option.value === value) || null;
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen; 
  }

  selectOption(option: { value: string; label: string }) {
    this.selectedOption = option; 
    this.isDropdownOpen = false; 
    this.formControl?.setValue(option.value); 
    this.selectionChange.emit(option); 
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false; 
    }
  }
}
