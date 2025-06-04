import { Component, inject, OnInit } from "@angular/core";
import { FormatDateService } from "../../../common/format-date-time/format-date.service";
import { BorrowService } from "../../../service/borrow/borrow-service.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "../../../service/auth/auth.service";
import { I18nService } from "../../../service/translate/i18n.service";
@Component({
  selector: "app-history-list",
  templateUrl: "./history-list.component.html",
  styleUrl: "./history-list.component.scss",
})
export class HistoryListComponent implements OnInit {
  loadingTable: boolean = false;
  Sort: boolean = true;
  page: number = 1;
  size = 10;
  showNoResultsMessage: boolean = false;
  totalElements: number = 0;
  searchHistory: FormGroup;
  dataHistory: any[] = [];
  totalPages: number = 0;
  selectedImage: string | null = null;

  auth = inject(AuthService);
  borrowService = inject(BorrowService);
  fb = inject(FormBuilder);
  spinner = inject(NgxSpinnerService);

  constructor(private i18n: I18nService, public formatDateService: FormatDateService) {
    this.searchHistory = this.fb.group({
      search: new FormControl(""),
    });
  }

  openImageModal(id: string | null): void {
    console.log("Image ID:", id);
    if (id) {
      this.borrowService.getborrowImage(id).subscribe({
        next: (response: any) => {
          this.selectedImage = response.image
            ? response.image
            : "https://www.islamspk.com/committee/no-pict.png";
        },
        error: (error) => {
          console.error("Error fetching image:", error);
        },
      });
    } else {
      console.error("No ID provided for image retrieval.");
    }
  }

  ngOnInit(): void {
    this.noGetHistoryData();
  }

  searchGet(event: any): void {
    this.page = 1;
    this.noGetHistoryData();
  }

  noGetHistoryData(): void {
    this.loadingTable = true;
    this.spinner.show();
    const searchValue = this.searchHistory.get("search")?.value || "";

    this.borrowService
      .searchGetHistoryData(searchValue, this.page, this.size, this.Sort)
      .subscribe(
        (res: any) => {
          this.dataHistory = res?.content ?? [];
          // console.log("Fetched data history:", this.dataHistory);
          this.totalElements = res?.totalElements ?? 0;
          this.showNoResultsMessage = this.dataHistory.length === 0;
          this.totalPages = res.totalPages;
          this.loadingTable = false;
        },
        (error) => {
          console.error("Error fetching data:", error);
          this.loadingTable = false;
        }
      );
  }

  toggleSort(): void {
    if (this.Sort) {
      this.dataHistory = this.dataHistory.sort((a, b) => a.id - b.id);
      this.Sort = false;
    } else {
      this.dataHistory = this.dataHistory.sort((a, b) => b.id - a.id);
      this.Sort = true;
    }
    this.noGetHistoryData();
  }

  onPageChange(pageNumber: number): void {
    this.page = pageNumber;
    this.noGetHistoryData();
  }

  get getLanguages(): string {
    return this.i18n.getLanguageLocal() || "th";
  }
}
