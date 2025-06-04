import { Component, inject, OnInit, ViewChild } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from "ng-apexcharts";
import { ReportServiceService } from "../../../service/report/report.service.service";
import { NgxSpinnerService } from "ngx-spinner";
import { I18nService } from "../../../service/translate/i18n.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CategoryServiceService } from "../../../service/category/category-service.service";
import { forkJoin } from "rxjs";
import { TopViewedBook } from "../../../service/interface/book";
import { TranslateService } from "@ngx-translate/core";

export type ChartOptionsBar = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
};

export type ChartOptionsPie = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
};

export type ChartOptionsStacked = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
};

export type ChartOptionsDonut = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
};

export type ChartOptionsBasicBar = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};

export type BooksTop5 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  stroke: ApexStroke;
  fill: ApexFill;
};

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit {
  reportService = inject(ReportServiceService);
  categoryService = inject(CategoryServiceService);
  spinner = inject(NgxSpinnerService);
  i18n = inject(I18nService);
  fb = inject(FormBuilder);
  translate = inject(TranslateService);

  public chartOptionsDonut: Partial<ChartOptionsStacked> | any;
  public chartBorrowingByPeriod: Partial<ChartOptionsStacked> | any;
  public barChartOptions: Partial<ChartOptionsBar> | any;

  @ViewChild("chartbarbasic") chartbarbasic!: ChartComponent;
  @ViewChild("charttop5") charttop5!: ChartComponent;
  public BooksTop5: Partial<BooksTop5> | any;

  public barBasicChart: Partial<ChartOptionsBasicBar> | any;
  @ViewChild("chartpie") chart!: ChartComponent;

  selectedTab: string = "graph";
  page: number = 1;
  size = 10;

  loading: boolean = false;

  showNoResultsMessage: boolean = false;
  totalElements: number = 0;
  dataMost: any[] = [];
  totalPages: number = 0;

  period: string = "week";
  period2: string = "week";
  limitOptions: number[] = [5, 10];
  selectedLimit: number = 10;

  selectedStartDate: string | null = null;
  selectedEndDate: string | null = null;
  selectedBorrower: any | null = null;

  today: Date = new Date();
  years: number[] = [];
  selectedYearBar: number = new Date().getFullYear();
  yearSelectDonut: number = new Date().getFullYear();

  categoryCodesInUse: any[] = [];
  reportData: any;
  reportbook: any;
  topViewedBooks: TopViewedBook[] = [];

  dataCategory: Array<{ categoryCode: string; categoryName: string }> = [];

  formreport: FormGroup;
  selectDate!: FormGroup;
  selectFormList!: FormGroup;

  constructor() {
    this.formreport = this.fb.group({
      datemothyear: [null],
    });
  }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 9;
    this.years = Array.from(
      { length: currentYear - startYear + 1 },
      (_, i) => currentYear - i
    );
    this.selectedYearBar = currentYear;
    this.yearSelectDonut = currentYear;

    this.selectFormList = this.fb.group({
      categoryCode: "",
      categoryCode2: "",
      categoryCode3: "",
    });

    this.selectDate = this.fb.group({
      dateStart: [null, [Validators.required]],
      dateEnd: [null, [Validators.required]],
    });

    this.setdatechart2("week");
    this.initializeData();
    this.getMostReqBorrow(this.period);
    this.onGetMonthlyBook();
    this.getTopViews();
    this.loadchart();

    this.translate.onLangChange.subscribe(() => {
      this.loadchart();
      this.onGetMonthlyBook();
      this.getTopViews();
    });
  }

  get dateStart() {
    return this.selectDate.get("dateStart");
  }
  get dateEnd() {
    return this.selectDate.get("dateEnd");
  }
  set dateStart(event) {
    this.selectDate.get("dateStart")?.setValue(event);
  }
  set dateEnd(event) {
    this.selectDate.get("dateEnd")?.setValue(event);
  }

  minStartFunc(): Date {
    return new Date();
  }
  minEndFunc() {
    const dateStart = this.selectDate.value.dateStart;
    return dateStart ? new Date(dateStart) : new Date();
  }

  // MaxStartFunc(): Date {
  //   const maxDate = new Date();
  //   maxDate.setMonth(maxDate.getMonth() + 7); // วันที่สูงสุดคือ 7 เดือนจากวันนี้
  //   return maxDate;
  // }

  initializeData() {
    this.loading = true;
    this.spinner.show();
    forkJoin([
      this.categoryService.getAllCategory(),
      this.categoryService.getAllCategoryCodesInUse(),

      this.reportService.getReportAll(),
    ]).subscribe(
      ([categories, categoryCodesInUses, reportData]) => {
        this.dataCategory = categories || [];
        this.categoryCodesInUse = categoryCodesInUses || [];
        this.reportData = reportData;
      },
      (error) => {
        console.error("Error initializing data:", error);
        this.loading = false;
      }
    );
  }

  get categoryCodeControl(): FormControl {
    return this.selectFormList.get("categoryCode") as FormControl;
  }
  get categoryCodeControl2(): FormControl {
    return this.selectFormList.get("categoryCode2") as FormControl;
  }
  get categoryCodeControl3(): FormControl {
    return this.selectFormList.get("categoryCode3") as FormControl;
  }

  get dropdownOptions() {
    if (
      !this.dataCategory ||
      this.dataCategory.length === 0 ||
      !this.dataCategory.length
    ) {
      return [{ value: "", label: "" }];
    }
    return this.dataCategory
      .filter((cat) => !this.checkNgIfCategory(cat.categoryCode))
      .map((cat) => ({
        value: cat.categoryCode,
        label: cat.categoryName,
      }));
  }

  onSelectionChange3({ value }: { value: string; label: string }) {
    this.selectFormList.patchValue({ categoryCode: value }, { emitEvent: false });
    // console.log(this.selectFormList.value);
    this.onGetMonthlyBook();
  }

  onGetMonthlyBook(): void {
    this.spinner.show();

    if (!this.selectedYearBar) return;
    const cateCode3 = this.selectFormList.value.categoryCode3 ?? undefined;

    this.reportService.getReportBorrowMoth(this.selectedYearBar, cateCode3).subscribe({
      next: (response) => {
        // console.log('Report Data:', response);
        const data = this.extractBorrowCounts(response);
        this.updateChart(data);
        setTimeout(() => {
          window.dispatchEvent(new Event("resize"));
        }, 100);
      },
      error: (error) => {
        console.error("Error fetching report:", error);
      },
    });
  }

  loadchart(): void {
    this.barBasicChart = {
      series: [
        {
          name: this.translate.instant("monthly_borrowing"),
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      stroke: {
        width: 2,
        colors: ["#fff"],
      },
      title: {
        text: this.translate.instant("monthly_borrowing"),
      },
      xaxis: {
        categories: [
          this.translate.instant("january"),
          this.translate.instant("february"),
          this.translate.instant("march"),
          this.translate.instant("april"),
          this.translate.instant("may"),
          this.translate.instant("june"),
          this.translate.instant("july"),
          this.translate.instant("august"),
          this.translate.instant("september"),
          this.translate.instant("october"),
          this.translate.instant("november"),
          this.translate.instant("december"),
        ],
        labels: {
          rotate: -45,
        },
      },
      yaxis: {
        title: {
          text: "จำนวนหนังสือที่ยืม",
        },
      },
      tooltip: {
        y: {
          formatter: (val: number) => {
            const suffix = this.translate.instant("copies") || "copies";
            return val + " " + suffix;
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40,
      },
    };
  }

  checkNgIfCategory(categoryCode: string): boolean {
    return !this.categoryCodesInUse.includes(categoryCode);
  }

  onSelectionChange({ value }: { value: string; label: string }) {
    this.selectFormList.patchValue({ categoryCode: value });
    // console.log(this.selectFormList.value);
    this.getTopViews();
  }

  setdatechart(newPeriod2: string) {
    this.period = newPeriod2;
    this.getMostReqBorrow(this.period);
  }

  setCaseType(caseType: string): void {
    this.selectedTab = caseType;
  }

  onSelectionChange2({ value }: { value: string; label: string }) {
    this.selectFormList.patchValue({ categoryCode: value }, { emitEvent: false });
    // console.log(this.selectFormList.value);
    this.getBorrowingByPeriods();
  }

  onLimitChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedLimit = Number(target.value);
    // console.log('Limit changed to:', this.selectedLimit);
    this.getTopViews();
  }

  // loadchartDonut(bookTop: any[]) {
  //   if (bookTop && Array.isArray(bookTop) && bookTop.length > 0) {
  //     const bookName = bookTop.map(item => item.bookNameTh);
  //     const seriesData = bookTop.map(item => item.borrowCount);

  //     this.updateDataChart(bookName, seriesData);
  //   } else {
  //     this.chartOptionsDonut.series = [];
  //     this.chartOptionsDonut.labels = [];
  //   }
  // }

  getTopViews(): void {
    this.loading = true;
    this.spinner.show();
    const cateCode = this.selectFormList.value.categoryCode ?? undefined;
    this.reportService.getTopViewedBooks(this.selectedLimit, cateCode).subscribe(
      (response: any) => {
        this.topViewedBooks = response;
        // console.log("this.topViewedBooks :", this.topViewedBooks);

        const currentLang = this.translate.currentLang || "th";
        const labels = this.getBookNamesByLanguage(currentLang);
        const seriesData = this.topViewedBooks.map((book: any) => book.totalView);

        // Call the chart update function
        this.updateTopViewedBooksChart(labels, seriesData);
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching top viewed books:", error);
        this.loading = false;
      }
    );
  }

  getBookNamesByLanguage(language: string): string[] {
    return this.topViewedBooks.map((book: any) => {
      return language === "en" ? book.bookNameEn : book.bookNameTh;
    });
  }

  updateTopViewedBooksChart(labels: string[], seriesData: number[]): void {
    this.BooksTop5 = {
      name: this.translate.instant("total_views"),
      series: seriesData,
      chart: {
        type: "polarArea",
        height: 350,
      },
      labels: labels,
      colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"], // Custom colors
      fill: {
        opacity: 0.8,
      },
      dataLabels: {
        enabled: true,
      },
      tooltip: {
        y: {
          formatter: (val: number) => {
            const suffix = this.translate.instant("times") || "ครั้ง"; // Localization for 'times'
            return val + " " + suffix;
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      legend: {
        position: "bottom",
      },
    };
  }

  loadchartTopViews(bookTop: any[]) {
    if (bookTop && Array.isArray(bookTop) && bookTop.length > 0) {
      const bookName = bookTop.map((item) => item.bookNameTh);
      const seriesData = bookTop.map((item) => item.borrowCount);

      this.updateDataChart(bookName, seriesData);
    } else {
      this.chartOptionsDonut.series = [];
      this.chartOptionsDonut.labels = [];
    }
  }

  updateDataChart(labelsData: string[], seriesData: number[]) {
    this.chartOptionsDonut = {
      series: seriesData,
      chart: {
        type: "donut",
        height: 350,
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
        },
        events: {
          legendClick: function (event: MouseEvent, context: any, options: any) {
            // console.log('legendClick Debug:', { event, context, options });

            if (!context?.chart) {
              console.error("context.chart ไม่ใช่วัตถุที่ถูกต้อง:", context);
              return;
            }

            const chartInstance = context?.chart;
            if (chartInstance?.toggleSeries) {
              const seriesName = options?.config?.labels[options.seriesIndex];
              chartInstance.toggleSeries(seriesName);
            } else {
              console.error("toggleSeries ไม่พบใน context.chart", chartInstance);
            }
          },
        },
      },
      labels: labelsData,
      title: {
        text: "หนังสือยอดนิยม",
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        itemMargin: {
          horizontal: 10,
          vertical: 5,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return val.toFixed(2) + "%";
        },
      },
      colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"],
      tooltip: {
        enabled: true,
      },

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };
  }

  getBorrowingByPeriods() {
    this.spinner.show();
    this.loading = true;
    const dtoReq = {
      category: this.selectFormList.value.categoryCode ?? null,
      dateStart: this.selectDate?.value?.dateStart ?? null,
      dateEnd: this.selectDate?.value?.dateEnd ?? null,
    };

    this.reportService.getBorrowingByPeriod(dtoReq).subscribe(
      (res) => {
        this.reportData = res;

        if (this.reportData && this.reportData.length > 0) {
          let totalBorrow = 0;
          let totalReturn = 0;
          let totalOverdue = 0;

          this.reportData.forEach((item: any) => {
            totalBorrow += item.borrow;
            totalReturn += item.returnBook;
            totalOverdue += item.overdue;
          });

          this.updateDonutChart([totalBorrow, totalReturn, totalOverdue]);
        }

        this.loading = false;
      },
      (error) => {
        console.error("Error fetching reports:", error);
        this.loading = false;
      }
    );
  }

  updateDonutChart(seriesData: number[]): void {
    this.chartBorrowingByPeriod = {
      series: seriesData,
      chart: {
        type: "donut",
        height: 350,
      },
      labels: [
        this.translate.instant("borrow"),
        this.translate.instant("return"),
        this.translate.instant("overdue"),
      ],
      legend: {
        position: "bottom",
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return val.toFixed(2) + "%";
        },
      },
      colors: ["#008FFB", "#00E396", "#FF4560"],
      tooltip: {
        y: {
          formatter: (val: number) => {
            const suffix = this.translate.instant("book_unit");
            return val + " " + suffix;
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };
  }

  updateChart(data: number[]): void {
    this.barBasicChart.series[0].data = data;
  }

  extractBorrowCounts(response: any[]): number[] {
    const borrowCounts = Array(12).fill(0);

    response.forEach((item) => {
      const monthIndex = item.month - 1;
      borrowCounts[monthIndex] = item.borrowCount;
    });

    return borrowCounts;
  }

  onDateChange(event: Date) {
    // this.selectedStartDate = event;
    this.formreport.patchValue({ datemothyear: event });
    // console.log(this.formreport.value);
  }

  getMostReqBorrow(period: string) {
    this.loading = true;
    this.spinner.show();
    this.reportService.getMostReqBorrow(this.period, this.page, this.size).subscribe(
      (response) => {
        this.dataMost = response?.content ?? [];
        // console.log(this.dataMost);

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

  setdatechart2(newPeriod3: string) {
    this.period2 = newPeriod3;
    // this.getBorrowingByPeriods();
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

  setTab(tab: string): void {
    this.selectedTab = tab;
  }

  formatDateToMMYYYY(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${month}/${year}`;
    return formattedDate;
  }

  get getLanguages(): string {
    return this.i18n.getLanguageLocal() || "th";
  }
}
