import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { NgxBarcode6Module } from "ngx-barcode6";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgApexchartsModule } from "ng-apexcharts";
import { ImageCropperModule } from "ngx-image-cropper";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { BookImageSpinnerComponent } from "../common/book-image-spinner/book-image-spinner.component";
import { DatepickerThComponent } from "../common/datepicker-th/datepicker-th.component";
import { PaginationComponent } from "../common/pagination/pagination.component";
import { SpinnerComponent } from "../common/spinner/spinner.component";
import { ButtonComponent } from "../common/button/button.component";
import { NotFoundComponent } from "../common/not-found/not-found.component";
import { VideoPlayerComponent } from "../common/video-player/video-player.component";
import { DropdownComponent } from "../common/dropdown/dropdown.component";
import { LineBreakPipe } from "../common/pipe/line-break.pipe";
import { DatepickerMonthYearComponent } from "../common/datepicker-month-year/datepicker-month-year.component";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./takeLibro/i18n/", ".json");
}

@NgModule({
  declarations: [
    BookImageSpinnerComponent,
    DatepickerThComponent,
    PaginationComponent,
    SpinnerComponent,
    ButtonComponent,
    NotFoundComponent,
    VideoPlayerComponent,
    DropdownComponent,
    LineBreakPipe,
    DatepickerMonthYearComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    BsDatepickerModule.forRoot(),
    NgxBarcode6Module,
    NgxSpinnerModule,
    NgApexchartsModule,
    ImageCropperModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    BsDatepickerModule,
    NgxBarcode6Module,
    NgxSpinnerModule,
    NgApexchartsModule,
    ImageCropperModule,
    TranslateModule,

    // components
    BookImageSpinnerComponent,
    DatepickerThComponent,
    PaginationComponent,
    SpinnerComponent,
    ButtonComponent,
    NotFoundComponent,
    VideoPlayerComponent,
    DropdownComponent,
    LineBreakPipe,
    DatepickerMonthYearComponent,
  ],
})
export class SharedModule {
  // constructor(private http: HttpClient) {
  //   this.http.get("./takeLibro/i18n/en.json").subscribe(
  //     (data) => {
  //       console.log("English JSON file:", data);
  //     },
  //     (error) => {
  //       console.error("Error loading English JSON file:", error);
  //     }
  //   );
  // }
}
