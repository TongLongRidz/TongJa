import { Component, inject, OnInit } from "@angular/core";
import { ReportServiceService } from "../../../service/report/report.service.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { I18nService } from "../../../service/translate/i18n.service";
import { NgxSpinnerService } from "ngx-spinner";

export interface BorrowingBookDTO {
  id: number;
  bookNameTh: string;
  bookNameEn: string;
  borrowCount: number;
}

export interface CategoryDto {
  id: number;
  categoryName: string;
  totalBorrow: number;
}

export interface DataStatic {
  borrow: BorrowingBookDTO[];
  categoryDto: CategoryDto[];
}

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrl: "./report.component.scss",
})
export class ReportComponent implements OnInit {
  public chartOptions: any;
  public chartcat: any;
  public charttrend: any;

  page: number = 1;
  size = 10;

  reportbook: any;
  reportcat: any;

  reportData: any;
  // dataMost:any;
  loading: boolean = false;

  showNoResultsMessage: boolean = false;
  totalElements: number = 0;
  dataMost: any[] = [];
  totalPages: number = 0;

  period: string = "week";

  formDate!: FormGroup;
  selectedStartDate: string | null = null;
  selectedEndDate: string | null = null;
  selectedBorrower: any | null = null;

  reportService = inject(ReportServiceService);
  fb = inject(FormBuilder);
  i18n = inject(I18nService);
  spinner = inject(NgxSpinnerService);

  constructor() {
    this.formDate = this.fb.group({
      startDate: [null],
      endDate: [null],
    });
  }

  ngOnInit(): void {
    this.getReporter();

    this.getMostReqBorrow(this.period);
    console.log("ngOnInit called");

    this.formDate.valueChanges.subscribe((formData) => {
      this.sendDate();
    });
  }

  today = new Date();

  get startDate() {
    return this.formDate.get("startDate");
  }

  get endDate() {
    return this.formDate.get("endDate");
  }

  set startDate(event) {
    this.formDate.get("startDate")?.setValue(event);
  }

  set endDate(event) {
    this.formDate.get("endDate")?.setValue(event);
  }

  onStartDateChange(event: any) {
    this.selectedStartDate = event;
    this.formDate.get("startDate")?.setValue(event);
  }
  onEndDateChange(event: any) {
    this.selectedEndDate = event;
    this.formDate.get("endDate")?.setValue(event);
  }

  getReporter() {
    this.loading = true;
    this.spinner.show();
    this.reportService.getReportAll().subscribe(
      (res) => {
        this.reportData = res;
        // console.log("reportData :", this.reportData);

        this.loading = false;
      },
      (error) => {
        console.error("Error fetching reports:", error);
        this.loading = false;
      }
    );
  }

  sendDate() {
    const startDate = this.formDate.get("startDate")?.value || null;
    const endDate = this.formDate.get("endDate")?.value || null;

    this.reportService.sendDate(startDate, endDate).subscribe(
      (response) => {
        this.reportbook = response.bookDTO.content;
        this.reportcat = response.categoryDTO;
        // console.log("report book:", this.reportbook);
        // console.log("report cat:", this.reportcat);
        this.processReportData(this.reportbook, this.reportcat);
      },
      (error) => {
        console.error("Error:", error);
      }
    );
  }

  processReportData(bookData: any[], catData: any[]): void {
    if (bookData && Array.isArray(bookData)) {
      const bookName = bookData.map((item) => item.bookNameTh);
      const seriesData = bookData.map((item) => item.borrowCount);
      this.updateChart(bookName, seriesData);
    } else {
      this.chartOptions.series = [];
    }

    if (catData && Array.isArray(catData)) {
      const seriesData = catData.map((item) => item.totalBorrow); // ข้อมูลจำนวนการยืม
      const labelsData = catData.map((item) => item.categoryName);
      this.updateCategoryChart(labelsData, seriesData);
    } else {
      this.chartcat.series = [];
    }
  }

  updateChart(bookName: string[], seriesData: number[]) {
    this.chartOptions = {
      series: [
        {
          name: "จำนวนการยืม",
          data: seriesData,
        },
      ],
      chart: {
        type: "bar",
      },
      title: {
        text: "การยืมตามหนังสือ",
      },
      xaxis: {
        categories: bookName,
      },
    };
  }

  updateCategoryChart(labelsData: string[], seriesData: number[]) {
    this.chartcat = {
      series: seriesData,
      chart: {
        type: "pie",
      },
      labels: labelsData,
      title: {
        text: "สถิติการยืมตามหมวดหมู่",
      },
      xaxis: {
        categories: labelsData,
      },
    };
  }

  updateTrendChart(labelsData: string[], seriesData: number[]) {
    this.charttrend = {
      series: seriesData,
      chart: {
        type: "line",
      },
      labels: labelsData,
      title: {
        text: "สถิติการยืมตามหมวดหมู่",
      },
      xaxis: {
        categories: labelsData,
      },
    };
  }

  getMostReqBorrow(period: string) {
    this.loading = true;
    this.spinner.show();
    this.reportService.getMostReqBorrow(this.period, this.page, this.size).subscribe(
      (response) => {
        this.dataMost = response?.content ?? [];
        console.log(this.dataMost);

        if (this.dataMost.length === 0) {
          this.showNoResultsMessage = true;
        } else {
          this.totalElements = response?.totalElements ?? 0;
          this.totalPages = response.totalPages ?? 0;
        }
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching most frequent borrowers:", error);
        this.loading = false;
      }
    );
  }

  setPeriod(newPeriod: string) {
    this.period = newPeriod;
    this.getMostReqBorrow(this.period);
  }
  onPageChange(pageNumber: number): void {
    this.page = pageNumber;
    this.getMostReqBorrow(this.period);
  }

  showDetails(dataMosts: any) {
    this.selectedBorrower = dataMosts;
  }

  forDate(date: string, lang: string): string {
    const dateObj = new Date(date);
    const monthsThai = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
    const monthsEnglish = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return lang === "en"
      ? `${
          monthsEnglish[dateObj.getMonth()]
        } ${dateObj.getDate()}, ${dateObj.getFullYear()}`
      : `วันที่ ${dateObj.getDate()} ${monthsThai[dateObj.getMonth()]} ${
          dateObj.getFullYear() + 543
        }`;
  }

  get getLanguages(): string {
    return this.i18n.getLanguageLocal() || "th";
  }
}
