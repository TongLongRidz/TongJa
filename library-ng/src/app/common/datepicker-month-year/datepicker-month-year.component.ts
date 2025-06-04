import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BsDatepickerConfig, BsLocaleService } from "ngx-bootstrap/datepicker";

@Component({
  selector: "app-datepicker-month-year",
  templateUrl: "./datepicker-month-year.component.html",
  styleUrl: "./datepicker-month-year.component.scss",
})
export class DatepickerMonthYearComponent implements OnInit {
  @Output() value = new EventEmitter<Date>();
  @Input() bsValue?: Date | undefined = undefined;
  @Input() minDate: Date | undefined = undefined;
  @Input() maxDate: Date | undefined = undefined;
  @Input() bgColor: "gray" | "white" = "gray";
  @Input() placeholder: string = "ดด/ปปปป";
  @Input() disabled: boolean = false;
  @Input() dateType: "TH" | "DF" = "DF";
  @Input() language: string = "th";
  @Output() isValid = new EventEmitter<{
    message: string;
    errors: { max?: boolean; min?: boolean };
  }>();

  localeTh = "th-be";
  localeEn = "en-be";
  dateBgColor: string = "";

  constructor(
    private localeService: BsLocaleService,
    private config: BsDatepickerConfig
  ) {
    this.localeService.use(this.language === "en" ? this.localeEn : this.localeTh);
    this.config.showWeekNumbers = false;
    this.config.isAnimated = false; // true BUG

    const datepickerConfig = new BsDatepickerConfig();
    // datepickerConfig.minMode = 'month';
    datepickerConfig.minMode = "month";
    datepickerConfig.dateInputFormat = "MM/YYYY";
  }

  ngOnInit(): void {
    if (this.bgColor === "gray") {
      this.dateBgColor = "#f8f8f8";
    } else if (this.bgColor === "white") {
      this.dateBgColor = "#ffffff";
    }
  }

  resetPlaceholder(): void {
    this.placeholder = "ปปปป";
  }

  onValueChange(value: Date): void {
    this.value.emit(value);
  }

  get BsValueType(): string {
    this.localeService.use(this.language === "en" ? "en-be" : "th-be");
    if (!this.bsValue) {
      return "";
    }

    if (this.dateType === "TH") {
      return this.forDate(this.bsValue, this.language);
    } else if (this.dateType === "DF") {
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
    const monthName = lang === 'en' ? monthsEnglish[dateObj.getMonth()] : monthsThai[dateObj.getMonth()];
    const year = lang === 'en' ? dateObj.getFullYear() : dateObj.getFullYear() + 543;
    return `${monthName} ${year}`;
  }

  // prettier-ignore
  private formatDate(date: Date, lang: string): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.warn('Invalid date provided to formatDate:', date);
      return ''; // Return an empty string if the date is invalid
    }

    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // เดือน (MM)
    const year = lang === 'en' ? date.getFullYear() : date.getFullYear() + 543; // ปี
    return `${month}/${year}`;
  }
}
