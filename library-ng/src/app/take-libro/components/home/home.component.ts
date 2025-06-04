import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { BookService } from "../../../service/book/book-service.service";
import { CategoryServiceService } from "../../../service/category/category-service.service";
import { Router } from "@angular/router";
import { BorrowService } from "../../../service/borrow/borrow-service.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertNormal } from "../../../common/alert-normal/alert-normal.service";
import { ProfileService } from "../../../service/profile/profile-service.service";
import { AuthService } from "../../../service/auth/auth.service";
import { I18nService } from "../../../service/translate/i18n.service";
import { TranslateService } from "@ngx-translate/core";
import { VideoPlayerService } from "../../../service/video/video-player.service";
import { FavoriteServiceService } from "../../../service/favorite/favorite-service.service";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  today = new Date();
  @ViewChild("datepickerInput", { static: false }) datepickerInput!: ElementRef;
  loadingTable: boolean = true;
  dataFormlist: any[] = [];
  dataCategory: Array<{ categoryCode: string; categoryName: string }> = [];
  dataListCatFavorite: any[] = [];

  page: number = 1;
  size: number = 15;
  categoryCode: string | null = null;
  // status: number | null = null;
  showNoResultsMessage: boolean = false;
  totalElements: number = 0;
  totalPages: number = 0;
  selectedStatus: string = "";

  selected: any;

  profileData: any;
  profileName: string = "";
  tokenName: string | null = null;

  homeVDO: boolean = true;

  selectFormList = new FormGroup({
    categoryCode: new FormControl(""),
    status: new FormControl(""),
  });

  private _status: string | null = null;

  statusOptions = [
    { value: "0", label: "ว่าง" },
    { value: "1", label: "ใช้งาน" },
  ];

  borrowForm!: FormGroup;
  selectedBook: any;
  placeholder: string = "วว/ดด/ปปปป";
  categoryCodesInUse: any[] = [];

  currentBoolean: boolean | undefined;
  dataStart: any = [];

  borrowCounts: { [key: string]: number } = {};
  viewCounts: { [key: string]: number } = {};

  bookService = inject(BookService);
  categoryService = inject(CategoryServiceService);
  borrowService = inject(BorrowService);
  profileService = inject(ProfileService);
  authService = inject(AuthService);
  favoriteService = inject(FavoriteServiceService);

  fb = inject(FormBuilder);
  router = inject(Router);
  Spinner = inject(NgxSpinnerService);

  constructor(
    private cdr: ChangeDetectorRef,
    private alert: AlertNormal,
    private i18n: I18nService,
    private translate: TranslateService,
    private videoPlayerService: VideoPlayerService
  ) {}

  ngOnInit(): void {
    this.getProfile();
    this.getCategoryData();
    this.loadCategoryCodesInUse();
    this.searchGet();
    this.setStatusLogin();

    this.borrowForm = this.fb.group({
      profileCode: [""],
      bookCode: [""],
      borrowStart: ["", [Validators.required]],
      borrowEnd: ["", [Validators.required]],
    });
  }

  get categoryCodeControl(): FormControl {
    return this.selectFormList.get("categoryCode") as FormControl;
  }
  get statusControl(): FormControl {
    return this.selectFormList.get("status") as FormControl;
  }
  get dropdownOptions() {
    if (!this.dataCategory || this.dataCategory.length === 0) {
      return [{ value: "", label: "" }];
    }
    return this.dataCategory
      .filter((cat) => !this.checkNgIfCategory(cat.categoryCode))
      .map((cat) => ({
        value: cat.categoryCode,
        label: cat.categoryName,
      }));
  }
  get borrowStart() {
    return this.borrowForm.get("borrowStart");
  }
  get borrowEnd() {
    return this.borrowForm.get("borrowEnd");
  }
  set borrowStart(event) {
    this.borrowForm.get("borrowStart")?.setValue(event);
  }
  set borrowEnd(event) {
    this.borrowForm.get("borrowEnd")?.setValue(event);
  }

  getListFavorite() {
    this.favoriteService
      .checkListFavorites(this.profileData?.profileCode)
      .subscribe((data) => {
        this.dataListCatFavorite = data;
      });
  }

  isFavorite(bookCode: string): boolean {
    const result =
      this.dataListCatFavorite?.some((favorite) => favorite.bookCode === bookCode) ||
      false;
    // console.log(`isFavorite(${bookCode}):`, result);
    return result;
  }
  addFavorite(bookCode: string): void {
    // console.log("bookCode:", bookCode);
    if (this.isFavorite(bookCode)) {
      console.log(`${bookCode} is already a favorite.`);
      return;
    }

    this.favoriteService.addFavorite(bookCode, this.profileData.profileCode).subscribe(
      (response) => {
        this.alert.show(this.translate.instant("add_favorite_success"), "", "success");
        this.getListFavorite();
      },
      (error) => {
        this.alert.show(
          this.translate.instant("add_favorite_failed") +
            " " +
            (error.status === 0 ? 404 : error.status),
          this.translate.instant("tryAgainLater"),
          "error"
        );
      }
    );
  }

  deleteFavorite(bookcode: string) {
    this.favoriteService.deleteFavorite(bookcode, this.profileData.profileCode).subscribe(
      (response) => {
        // console.log("Deleted favorite:", bookcode);
        this.alert.show(this.translate.instant("cancel_favorite_success"), "", "success");
        this.getListFavorite();
      },
      (error) => {
        this.alert.show(
          this.translate.instant("cancel_favorite_failed") +
            " " +
            (error.status === 0 ? 404 : error.status),
          this.translate.instant("tryAgainLater"),
          "error"
        );
      }
    );
  }

  toggleFavorite(bookcode: string): void {
    if (this.isFavorite(bookcode)) {
      this.deleteFavorite(bookcode);
      this.getListFavorite();
    } else {
      this.addFavorite(bookcode);
      console.log("add :", bookcode);
      this.getListFavorite();
    }
  }

  resetForm(): void {
    this.loadingTable = true;
    this.selectFormList.reset({
      categoryCode: "",
      status: "",
    });
    this.selectFormList.patchValue({ categoryCode: "", status: "" });
    this.selectFormList.updateValueAndValidity();
    this.page = 1;
    this.borrowForm.reset({
      borrowerName: "",
      borrowStart: "",
      borrowEnd: "",
    });
    this.searchGet();
  }

  onSelectionChange({ value }: { value: string; label: string }) {
    if (value) {
      this.loadingTable = true;
      this.selectFormList.patchValue({ categoryCode: value });
      console.log(this.selectFormList.value);
      this.searchGet();
    }
  }

  onSelectionStatusChange({ value }: { value: string; label: string }): void {
    if (value) {
      this.loadingTable = true;
      this.selectFormList.patchValue({ status: value });
      this.searchGet();
    }
  }

  setHomeVDO(status: boolean) {
    this.videoPlayerService.changVideoHome(status);
  }

  fetchBookBorrowCounts(): void {
    this.bookService.getBookBorrowCounts().subscribe(
      (data) => {
        this.borrowCounts = {};
        this.viewCounts = {};
        data.forEach((item) => {
          this.borrowCounts[item[0]] = item[1];
          this.viewCounts[item[0]] = item[2];
        });
      },
      (error) => {
        console.error("Error fetching book borrow counts:", error);
      }
    );
  }

  searchGet(): void {
    this.Spinner.show();
    this.loadingTable = true;
    this.categoryCode = this.selectFormList.get("categoryCode")?.value || null;
    const statusValue = this.selectFormList.get("status")?.value || null;
    this.fetchBookBorrowCounts();
    this.bookService
      .searchGetBookList(this.page, this.size, this.categoryCode, statusValue)
      .subscribe(
        (res: any) => {
          this.authService.setStatusLogin(false);
          this.dataFormlist = res.content || [];
          this.totalElements = res.totalElements ?? 0;
          this.showNoResultsMessage = this.dataFormlist.length === 0;
          this.totalPages = res.totalPages;

          // console.log(this.dataFormlist);
          this.dataFormlist.forEach((book) => {
            book.borrowCount = this.borrowCounts[book.bookCode] || 0;
            book.viewCount = this.viewCounts[book.bookCode] || 0;
          });
          this.loadingTable = false;
        },
        (error) => {
          this.loadingTable = false;
        }
      );
  }

  getProfile(): void {
    this.tokenName = this.authService.getToken();
    if (this.tokenName) {
      const payload = this.authService.decodeTokenJWT(this.tokenName);
      if (payload) {
        this.profileService.getProfileByIdEntity(payload.id).subscribe(
          (response) => {
            this.profileData = response;
            this.getListFavorite();
          },
          (error) => {
            console.error("header get Error:", error);
          }
        );
      }
    }
  }

  getCategoryData(): void {
    this.categoryService.getAllCategory().subscribe(
      (response) => {
        this.dataCategory = response || [];
        this.cdr.detectChanges();
      },
      (error) => {
        console.error("Error fetching categories:", error);
      }
    );
  }

  openModal(book: any) {
    this.profileName = `${this.profileData.firstName} ${this.profileData.lastName}`;
    // console.log('profileName', this.profileName);
    this.resetForm();
    this.selectedBook = book;
    this.borrowForm.get("profileCode")?.setValue(this.profileData.profileCode);
    this.borrowForm.get("bookCode")?.setValue(book.bookCode);
  }

  bookDetail(id: number) {
    // this.bookService.setIdBookDetailFunc(id);
    // this.router.navigateByUrl('/book-detail');
    this.bookService.incrementTotalView(id).subscribe({
      next: () => {
        this.router.navigate(["/take-libro/book", id]);
      },
      error: (err) => {
        console.error("Error incrementing view count", err);
        this.router.navigate(["/take-libro/book", id]); // ยังคงให้ไปที่หน้า book-detail
      },
    });
  }

  minStartFunc() {
    return new Date();
  }

  MaxStartFunc() {
    const today = new Date();
    const maxStartDate = new Date(today);
    maxStartDate.setMonth(today.getMonth() + 7);
    return maxStartDate;
  }

  minEndFunc() {
    const borrowStart = this.borrowForm.value.borrowStart;
    return borrowStart ? new Date(borrowStart) : new Date();
  }

  // MaxEndFunc() {
  //   const borrowStart = this.borrowForm.value.borrowStart;
  //   if (!borrowStart) {
  //     const today = new Date();
  //     const maxDate = new Date(today);
  //     maxDate.setMonth(today.getMonth() + 3);
  //     return maxDate;
  //   } else {
  //     const borrowStartDate = new Date(borrowStart);
  //     const maxEndDate = new Date(borrowStartDate);
  //     maxEndDate.setDate(borrowStartDate.getDate() + 6);
  //     return maxEndDate;
  //   }
  // }

  forDate(newDate: string): string {
    const dateObj = new Date(newDate);
    const day = dateObj.getDate();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear() + 543;
    return `${day}/${month}/${year}`;
  }

  onSubmit() {
    // console.log('borrowForm :', this.borrowForm.value);
    if (this.borrowForm.valid) {
      const borrowData = {
        ...this.borrowForm.value,
        bookCode: this.selectedBook.bookCode,
      };
      this.borrowService.saveBorrowData(borrowData).subscribe(
        (response) => {
          // console.log('borrowData', borrowData);

          (document.getElementById("closeModalButton") as HTMLElement).click();
          this.alert.show(this.translate.instant("borrowSuccess"), "", "success");
          this.loadingTable = false;
          this.searchGet();
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
    } else {
      const errorMessages = [];
      if (this.borrowForm.get("borrowerName")?.hasError("noWhitespace")) {
        errorMessages.push(this.translate.instant("borrowerNameNoWhitespace"));
      }
      if (this.borrowForm.get("borrowerName")?.hasError("required")) {
        errorMessages.push(this.translate.instant("borrowerNameRequired"));
      }
      if (this.borrowForm.get("borrowStart")?.hasError("required")) {
        errorMessages.push(this.translate.instant("selectBorrowDate"));
      }
      if (this.borrowForm.get("borrowEnd")?.hasError("required")) {
        errorMessages.push(this.translate.instant("selectReturnDate"));
      }
      this.alert.show(errorMessages.join("<br/>"), "", "warning");
    }
  }

  noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return [{ value: "", label: "No categories available" }]; // ค่า fallback
  }

  onPageChange(pageNumber: number): void {
    this.page = pageNumber;
    this.searchGet();
  }

  closeModal() {
    this.borrowForm.reset({
      borrowerName: "",
      borrowStart: "",
      borrowEnd: "",
    });
  }

  navigate() {
    this.router.navigateByUrl("/take-libro/books");
  }

  loadCategoryCodesInUse() {
    this.categoryService.getAllCategoryCodesInUse().subscribe((codes: string[]) => {
      this.categoryCodesInUse = codes;
    });
  }

  checkNgIfCategory(categoryCode: string): boolean {
    if (!this.categoryCodesInUse || this.categoryCodesInUse.length === 0) return false;
    return !this.categoryCodesInUse.includes(categoryCode);
  }

  checkStatus(bookStatus: string): boolean {
    if (!this.dataFormlist || this.dataFormlist.length === 0) {
      return false;
    }
    return this.dataFormlist.some((item) => item.status.toString() === bookStatus);
  }

  setStatusLogin(): void {
    this.authService.boolean$.subscribe((value) => {
      this.currentBoolean = value;
    });
  }

  // shuffleArray(array: any[]): any[] {
  //   for (let i = array.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [array[i], array[j]] = [array[j], array[i]];
  //   }
  //   return array;
  // }

  get getLanguages(): string {
    return this.i18n.getLanguageLocal() || "th";
  }
}
