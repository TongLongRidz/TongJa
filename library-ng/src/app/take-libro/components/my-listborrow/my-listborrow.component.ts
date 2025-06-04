import { Component, inject } from "@angular/core";
import { FormatDateService } from "../../../common/format-date-time/format-date.service";
import { BorrowService } from "../../../service/borrow/borrow-service.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertNormal } from "../../../common/alert-normal/alert-normal.service";
import { ProfileService } from "../../../service/profile/profile-service.service";
import { AuthService } from "../../../service/auth/auth.service";
import { I18nService } from "../../../service/translate/i18n.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-my-listborrow",
  templateUrl: "./my-listborrow.component.html",
  styleUrl: "./my-listborrow.component.scss",
})
export class MyListborrowComponent {
  loadingTable: boolean = false;
  Sort: boolean = true;
  page: number = 1;
  size = 10;
  showNoResultsMessage: boolean = false;
  totalElements: number = 0;
  searchHistory: FormGroup;
  dataHistory: any[] = [];
  totalPages: number = 0;
  status = 1;

  minDate: Date = new Date();

  profileData: any;
  profileName: string = "";
  tokenName: string | null = null;

  cacheBorrowStatus: number | null = null;
  cacheBorrowEnd: Date | null = null;
  waitUpdateBorrowEnd: Date | null = null;

  selectedImage: string | ArrayBuffer | null = null;

  borrowService = inject(BorrowService);
  fb = inject(FormBuilder);
  alert = inject(AlertNormal);
  spinner = inject(NgxSpinnerService);
  profileService = inject(ProfileService);
  authService = inject(AuthService);

  constructor(
    private i18n: I18nService,
    private translate: TranslateService,
    public formatDateService: FormatDateService
  ) {
    this.searchHistory = this.fb.group({
      search: new FormControl(""),
      status: new FormControl(""),
    });
  }

  newBorrowForm: FormGroup = this.fb.group({
    id: new FormControl(null),
    borrowerName: new FormControl(null),
    bookNameTh: new FormControl(null),
    bookNameEn: new FormControl(null),
    borrowStart: new FormControl(null),
    borrowEnd: new FormControl(null),
    borrowStatus: new FormControl(0),
    active: new FormControl(null),
    borrowImage: new FormControl(null),
  });

  ngOnInit(): void {
    this.getProfile();
  }

  get borrowEnd() {
    return this.newBorrowForm.get("borrowEnd");
  }

  today = new Date();

  set borrowEnd(event) {
    this.newBorrowForm.get("borrowEnd")?.setValue(this.today);
  }

  onBorrowStatusChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    this.newBorrowForm.patchValue({
      borrowStatus: isChecked ? 1 : 0,
    });
    // console.log('isChecked', isChecked);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.selectedImage = e.target.result;
          this.newBorrowForm.patchValue({ borrowImage: this.selectedImage });
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  clearImage(): void {
    this.selectedImage = null;
    this.newBorrowForm.patchValue({ borrowImage: null });
  }

  changeImage(): void {
    const fileInput = document.getElementById("upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  SubmitBorrow() {
    if (!this.newBorrowForm.value.borrowImage) {
      console.error("borrowImage is undefined");
      return;
    }
    if (
      this.newBorrowForm.value.borrowStatus === 0 &&
      this.newBorrowForm.value.borrowImage === "null"
    ) {
      this.alert.show(this.translate.instant("uploadImage"), "", "warning");
      return;
    }

    let active = "";

    if (this.waitUpdateBorrowEnd?.getTime() !== this.cacheBorrowEnd?.getTime()) {
      active = "slip";
    } else if (this.newBorrowForm.value.borrowStatus !== this.cacheBorrowStatus) {
      active = this.newBorrowForm.value.borrowStatus === 1 ? "borrow" : "return";
    }

    console.log("active : ", active);

    this.newBorrowForm.patchValue({
      active: active,
    });

    this.borrowService.editBorrowBook(this.newBorrowForm.value).subscribe(
      (response) => {
        this.alert.show(this.translate.instant("extendDueDateSuccess"), "", "success");
        (document.getElementById("closeModalButtonBorrow") as HTMLElement).click();
        this.noGetMyListborrowData();
      },
      (error) => {
        this.alert.show(
          this.translate.instant("errorOccurred") +
            " " +
            (error.status === 0 ? 404 : error.status),
          this.translate.instant("tryAgainLater"),
          "error"
        );
      }
    );
  }

  isOverdue(borrowEnd: Date): boolean {
    const currentDate = new Date();
    return new Date(borrowEnd) < currentDate;
  }

  isReturnToday(borrowEnd: Date): boolean {
    const currentDate = new Date();
    const endDate = new Date(borrowEnd);

    return (
      endDate.getFullYear() === currentDate.getFullYear() &&
      endDate.getMonth() === currentDate.getMonth() &&
      endDate.getDate() === currentDate.getDate()
    );
  }

  onDateSelected(event: Date): void {
    this.waitUpdateBorrowEnd = new Date(event);
    this.newBorrowForm.patchValue({ borrowEnd: event });
  }

  openModalHis(id: number): void {
    this.resetForm();
    this.newBorrowForm.reset();
    const selectedHistory = this.dataHistory.find((history: any) => history.id === id);
    if (selectedHistory) {
      const borrowerName = `${selectedHistory.firstName} ${selectedHistory.lastName}`;
      this.newBorrowForm.patchValue({
        id: id,
        borrowerName: borrowerName,
        bookNameTh: selectedHistory.bookNameTh,
        bookNameEn: selectedHistory.bookNameEn,
        borrowStart: this.formatDateService.forDate(
          selectedHistory.borrowStart,
          "MIN",
          "NO-TIME",
          this.getLanguages
        ),
        borrowEnd: new Date(selectedHistory.borrowEnd),
        borrowStatus: selectedHistory.borrowStatus,
        borrowImage: "null",
      });

      this.cacheBorrowEnd = new Date(selectedHistory.borrowEnd);
      this.waitUpdateBorrowEnd = new Date(selectedHistory.borrowEnd);
    }
  }

  searchGet(event: any): void {
    this.page = 1;
    this.noGetMyListborrowData();
  }

  getProfile(): void {
    this.tokenName = this.authService.getToken();
    if (this.tokenName) {
      const payload = this.authService.decodeTokenJWT(this.tokenName);
      if (payload) {
        this.profileService.getProfileByIdEntity(payload.id).subscribe(
          (response) => {
            this.profileData = response;
            this.noGetMyListborrowData();
          },
          (error) => {
            console.error("header get Error:", error);
          }
        );
      }
    }
  }

  noGetMyListborrowData(): void {
    this.loadingTable = true;
    this.spinner.show();
    const searchValue = this.searchHistory.get("search")?.value || "";

    const profileCodes = this.profileData.profileCode;

    if (!profileCodes) {
      console.error("Profile code is undefined");
      this.loadingTable = false;
      this.spinner.hide();
      return;
    }

    this.borrowService
      .searchGetMyListborrowData(
        searchValue,
        profileCodes,
        this.page,
        this.size,
        this.Sort,
        this.status
      )
      .subscribe(
        (res: any) => {
          this.dataHistory = res?.content ?? [];
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
    this.noGetMyListborrowData();
  }

  onPageChange(pageNumber: number): void {
    this.page = pageNumber;
    this.noGetMyListborrowData();
  }

  resetForm(): void {
    this.newBorrowForm.reset();
    this.selectedImage = null;
  }

  get getLanguages(): string {
    return this.i18n.getLanguageLocal() || "th";
  }
}
