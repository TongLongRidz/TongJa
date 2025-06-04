import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  colors = {
    add: '#58d68d',
    edit: '#f4d03f',
    cancel: '#95a5a6',
    reset: '#f25353',
    delete: '#ec7063',
    disabled: '#aab7b8',
    styb1: '#16423C',
    styb2: '#6A9C89',
    router2: '#48b1d8',
    router3: '#E8B86D',
    details: '#48b1d8',
    borrow0: '#48c9b0',
    borrow1: '#f0ad4e',
    borrow2: '#538392',
  };

  @Input() color: keyof typeof this.colors = 'add';
  @Input() text?: string;
  @Input() icon?: string;
  @Input() disabled: boolean = false;
  @Input() width: string = '65px';
  @Input() type?: string = 'button';
  @Input() ruleStyle: 'NORMAL' | 'TABLE' = 'NORMAL';

  get backgroundColor() {
    return this.colors[this.color] || this.colors.add;
  }
}
