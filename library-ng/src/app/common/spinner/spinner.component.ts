import { Component, inject, Input, input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner'; 

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {


  constructor(private spinnerService: NgxSpinnerService) {}


  show() {
    this.spinnerService.show();
  }

  hide() {
    this.spinnerService.hide();
  }
}