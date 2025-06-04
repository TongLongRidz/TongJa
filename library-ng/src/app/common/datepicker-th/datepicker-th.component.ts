import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-datepicker-th',
  templateUrl: './datepicker-th.component.html',
  styleUrl: './datepicker-th.component.scss',
})
export class DatepickerThComponent implements OnInit {
  @Output() value = new EventEmitter<Date>();
  @Input() bsValue?: Date | undefined = undefined;
  @Input() minDate: Date | undefined = undefined;
  @Input() maxDate: Date | undefined = undefined;
  @Input() bgColor: 'gray' | 'white' = 'gray';
  @Input() placeholder: string = 'วว/ดด/ปปปป';
  @Input() disabled: boolean = false;
  @Input() dateType: 'TH' | 'DF' = 'DF';
  @Input() language: string = 'th';
  @Output() isValid = new EventEmitter<{
    message: string;
    errors: { max?: boolean; min?: boolean };
  }>();

  localeTh = 'th-be';
  localeEn = 'en-be';
  dateBgColor: string = '';

  constructor(
    private localeService: BsLocaleService,
    private config: BsDatepickerConfig
  ) {
    this.localeService.use(this.language === 'en' ? this.localeEn : this.localeTh);
    this.config.showWeekNumbers = false;
    this.config.isAnimated = false; // BUG true
  }

  ngOnInit(): void {
    if (this.bgColor === 'gray') {
      this.dateBgColor = '#f8f8f8';
    } else if (this.bgColor === 'white') {
      this.dateBgColor = '#ffffff';
    }
    
  }

  resetPlaceholder(): void {
    this.placeholder = 'วว/ดด/ปปปป';
  }

  onValueChange(value: Date): void {
    this.value.emit(value);
  }

  get BsValueType(): string {
    this.localeService.use(this.language === 'en' ? 'en-be' : 'th-be');
    if (!this.bsValue) {
      return '';
    }

    if (this.dateType === 'TH') {
      return this.forDate(this.bsValue, this.language);
    } else if (this.dateType === 'DF') {
      return this.formatDate(this.bsValue, this.language);
    } else {
      return this.formatDate(this.bsValue, this.language);
    }
  }

  // prettier-ignore
  forDate(date: Date, lang: string): string {
    const dateObj = new Date(date);
    const monthsThai = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
    ];
    const monthsEnglish = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    return lang === 'en' ? `${monthsEnglish[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}` : `วันที่ ${dateObj.getDate()} ${monthsThai[dateObj.getMonth()]} ${dateObj.getFullYear() + 543}`;
  }

  // prettier-ignore
  private formatDate(date: Date, lang: string): string {
    const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
    const month = date.getMonth() < 10 ? `0${date.getMonth()}` : `${date.getMonth()}`;
    const year = date.getFullYear() + (lang === 'en' ? 0 : 543);

    return `${day}/${month}/${year}`;
  }
}
