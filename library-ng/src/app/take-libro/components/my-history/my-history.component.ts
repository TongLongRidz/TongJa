import { Component, inject, OnInit } from "@angular/core";
import { FormatDateService } from "../../../common/format-date-time/format-date.service";
import { BorrowService } from "../../../service/borrow/borrow-service.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ProfileService } from "../../../service/profile/profile-service.service";
import { AuthService } from "../../../service/auth/auth.service";
import { I18nService } from "../../../service/translate/i18n.service";

@Component({
  selector: "app-my-history",
  templateUrl: "./my-history.component.html",
  styleUrl: "./my-history.component.scss",
})
export class MyHistoryComponent {
  loadingTable: boolean = false;
  Sort: boolean = true;
  page: number = 1;
  size = 10;
  showNoResultsMessage: boolean = false;
  totalElements: number = 0;
  searchHistory: FormGroup;
  dataHistory: any[] = [];
  totalPages: number = 0;
  status: number | null = null;
  profileData: any;
  profileName: string = "";
  tokenName: string | null = null;

  borrowService = inject(BorrowService);
  fb = inject(FormBuilder);
  spinner = inject(NgxSpinnerService);
  profileService = inject(ProfileService);
  authService = inject(AuthService);

  constructor(private i18n: I18nService, public formatDateService: FormatDateService) {
    this.searchHistory = this.fb.group({
      search: new FormControl(""),
    });
  }

  ngOnInit(): void {
    this.getProfile();
  }

  selectedImage: string | null = null;

  openImageModal(id: string | null): void {
    // console.log('Image ID:', id);
    if (id) {
      this.borrowService.getborrowImage(id).subscribe({
        next: (response: any) => {
          this.selectedImage = response.image
            ? response.image
            : "https://www.islamspk.com/committee/no-pict.png";
          // console.log('Fetched Base64 image:', this.selectedImage);
        },
        error: (error) => {
          console.error("Error fetching image:", error);
        },
      });
    } else {
      console.error("No ID provided for image retrieval.");
    }
  }

  searchGet(event: any): void {
    this.page = 1;
    this.noGetHistoryData();
  }

  getProfile(): void {
    this.tokenName = this.authService.getToken();
    if (this.tokenName) {
      const payload = this.authService.decodeTokenJWT(this.tokenName);
      if (payload) {
        this.profileService.getProfileByIdEntity(payload.id).subscribe(
          (response) => {
            this.profileData = response;
            this.noGetHistoryData();
          },
          (error) => {
            console.error("header get Error:", error);
          }
        );
      }
    }
  }

  noGetHistoryData(): void {
    this.loadingTable = true;
    this.spinner.show();
    const searchValue = this.searchHistory.get("search")?.value || "";
    const profileCode = this.profileData.profileCode;

    this.borrowService
      .searchGetMyHistoryData(
        searchValue,
        profileCode,
        this.page,
        this.size,
        this.Sort,
        this.status
      )
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
    this.Sort = !this.Sort;
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
