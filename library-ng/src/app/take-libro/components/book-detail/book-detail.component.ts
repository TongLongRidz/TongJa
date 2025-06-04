import { Component, inject, OnInit } from "@angular/core";
import { BookService } from "../../../service/book/book-service.service";
import {
  BookDetail,
  AddCommentInterface,
  getCommentsInterface,
} from "../../../service/interface/book";
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AlertNormal } from "../../../common/alert-normal/alert-normal.service";
import { BorrowService } from "../../../service/borrow/borrow-service.service";
import { AuthService } from "../../../service/auth/auth.service";
import { ProfileService } from "../../../service/profile/profile-service.service";
import { IMAGE_CONFIG } from "@angular/common";
import { I18nService } from "../../../service/translate/i18n.service";
import { TranslateService } from "@ngx-translate/core";
import { ProfileByIdInterface } from "../../../service/interface/profile";
import { FormatDateService } from "../../../common/format-date-time/format-date.service";
import { AppComponent } from "../../../app/app.component";
// import {} from "../../service/interface/book";

@Component({
  selector: "app-book-detail",
  templateUrl: "./book-detail.component.html",
  styleUrl: "./book-detail.component.scss",
})
export class BookDetailComponent implements OnInit {
  spinner = inject(NgxSpinnerService);
  constructor(
    private bookSvice: BookService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private alert: AlertNormal,
    private borrowService: BorrowService,
    private authService: AuthService,
    private profileService: ProfileService,
    private i18n: I18nService,
    private translate: TranslateService,
    public formatDateService: FormatDateService,
    private router: Router,
    private main_class: AppComponent
  ) {}
  bookDetail: BookDetail | undefined;
  bookRecommend: BookDetail[] | undefined;
  loadingTable: boolean = false;
  showTable: boolean = true;
  showRecommend: boolean = true;
  showComments: boolean = true;
  inputComments: string = "";
  profileData: ProfileByIdInterface | null = null;
  bookComments: getCommentsInterface | null = null;

  pageComment: number = 1;
  sizeComment: number = 5;

  commentLoading: boolean = false;

  ngOnInit() {
    this.saveBookId(+this.route.snapshot.paramMap.get("id")!);
    this.loadingOnPage();
    this.loadUser();
    this.listenForBackNavigation();
  }

  indexBookId: number[] = [];
  saveBookId(id: number) {
    this.indexBookId.push(id);
  }

  editPathUrl(id: number) {
    this.router.navigate([`/take-libro/book/${id}`]);
    this.saveBookId(id);
    this.loadingOnPage();
    this.loadUser();
  }

  loadingOnPage(): void {
    const id = this.indexBookId[this.indexBookId.length - 1];
    if (id !== 0) {
      this.loadingTable = true;
      this.spinner.show(); // This will show spinner during the request.
      this.bookSvice.getBookDetailByID(id).subscribe(
        (response) => {
          this.bookDetail = response;
          this.loadingTable = false;
          this.spinner.hide();
          this.bookSvice.getBookRecommend(id).subscribe(
            (resBook) => {
              this.bookRecommend = resBook;
              this.loadingTable = false;
              this.spinner.hide();
              this.loadBookComments();
            },
            (error) => {
              console.error("Error loading books:", error);
              this.loadingTable = false;
              this.spinner.hide();
            }
          );
        },
        (error) => {
          console.error("Error loading books:", error);
          this.loadingTable = false;
          this.spinner.hide();
        }
      );
    }
  }

  loadUser() {
    const tokenName = this.authService.getToken();
    if (tokenName) {
      const payload = this.authService.decodeTokenJWT(tokenName);
      if (payload) {
        this.commentLoading = true;
        this.profileService.getProfileByIdEntity(payload.id).subscribe(
          (response) => {
            this.profileData = response;
            this.commentLoading = false;
          },
          (error) => {
            console.error("header get Error:", error);
            this.commentLoading = false;
          }
        );
      }
    } else {
      console.log("not logged");
    }
  }

  selectedImage: string | undefined;
  openImageModal(imageUrl: string | undefined): void {
    this.selectedImage = imageUrl ?? "https://www.islamspk.com/committee/no-pict.png";
  }

  // borrow book
  newBorrowForm = this.fb.group({
    profileCode: new FormControl<string | null>(null),
    bookCode: new FormControl<string | null>(null),
    borrowStart: new FormControl<Date | null>(null, Validators.required),
    borrowEnd: new FormControl<Date | null>(null, Validators.required),
  });

  borrowStartSet: Date | undefined;
  borrowEndSet: Date | undefined;

  onSubmit() {
    if (this.newBorrowForm.valid) {
      this.borrowService.saveBorrowData(this.newBorrowForm.value).subscribe(
        (response) => {
          this.alert.show(this.translate.instant("borrowSuccess"), "", "success");
          this.loadingTable = false;
          (document.getElementById("closeModalButton") as HTMLElement).click();
          this.loadingOnPage();
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
      if (this.newBorrowForm.get("borrowStart")?.hasError("required")) {
        errorMessages.push(this.translate.instant("selectStartDate"));
      }
      if (this.newBorrowForm.get("borrowEnd")?.hasError("required")) {
        errorMessages.push(this.translate.instant("selectEndDate"));
      }
      const borrowStart = this.newBorrowForm.get("borrowStart")?.value;
      const borrowEnd = this.newBorrowForm.get("borrowEnd")?.value;
      if (borrowStart && borrowEnd && new Date(borrowEnd) < new Date(borrowStart)) {
        errorMessages.push(this.translate.instant("endDateValidation"));
      }
      this.alert.show(errorMessages.join("<br/>"), "", "warning");
    }
  }

  setDate(date: Date, ruleType: "START" | "END"): void {
    if (date instanceof Date && !isNaN(date.getTime())) {
      if (ruleType === "START") {
        this.borrowStartSet = date;
        this.newBorrowForm.patchValue({ borrowStart: date });
      } else if (ruleType === "END") {
        this.borrowEndSet = date;
        this.newBorrowForm.patchValue({ borrowEnd: date });
      }
    }
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
    const borrowStart = this.newBorrowForm.value.borrowStart;
    return borrowStart ? new Date(borrowStart) : new Date();
  }

  get buttonName(): string {
    const status = this.bookDetail?.bookStatus;
    return status === 0
      ? this.translate.instant("borrowBook")
      : this.translate.instant("currentlyReading");
  }

  openModalResetValue(): void {
    this.newBorrowForm.reset();
    this.borrowStartSet = undefined;
    this.borrowEndSet = undefined;

    this.newBorrowForm.patchValue({
      bookCode: this.bookDetail?.bookCode,
      profileCode: this.profileData?.profileCode,
    });
  }
  get nameUser() {
    return this.profileData?.firstName + " " + this.profileData?.lastName;
  }

  get getLanguages(): string {
    return this.i18n.getLanguageLocal() || "th";
  }

  postComments(): void {
    if (this.bookDetail?.bookCode != null) {
      if (this.inputComments.trim() !== "") {
        if (this.profileData?.profileCode != null) {
          const commentForm: AddCommentInterface = {
            bookCode: this.bookDetail?.bookCode,
            profileCode: this.profileData?.profileCode,
            commentText: this.inputComments,
          };

          this.bookSvice.addComment(commentForm).subscribe(
            (res) => {
              // add comment
              if (!this.bookComments) {
                this.bookComments = {
                  content: [],
                  totalElements: 0,
                  totalPages: 1,
                };
              }

              const commentItem = {
                id: res,
                bookCode: this.bookDetail?.bookCode || "",
                profileCode: this.profileData?.profileCode || "",
                firstName: this.profileData?.firstName || "",
                lastName: this.profileData?.lastName || "",
                commentText: this.inputComments || "",
                image: this.profileData?.image || "",
                createAt: new Date().toISOString(),
              };

              this.bookComments.totalElements += 1;
              this.bookComments.content.unshift(commentItem);
              this.bookComments.totalPages = Math.ceil(
                this.bookComments.totalElements / this.sizeComment
              );

              if (this.bookComments.content.length > this.sizeComment) {
                this.bookComments.content.pop();
              }
              this.inputComments = "";
            },
            (err) => {
              console.log("Error adding comment => ", err);
            }
          );
        } else {
          this.alert.show(
            this.translate.instant("commenterNotFound"),
            this.translate.instant("tryAgainLater"),
            "warning"
          );
        }
      } else {
        this.alert.show(
          this.translate.instant("noDataFound"),
          this.translate.instant("tryAgainLater"),
          "warning"
        );
      }
    } else {
      this.alert.show(
        this.translate.instant("bookNotFound"),
        this.translate.instant("tryAgainLater"),
        "warning"
      );
    }
  }

  loadBookComments() {
    this.commentLoading = true;
    if (this.bookDetail?.bookCode) {
      this.bookSvice
        .getComments(this.bookDetail?.bookCode, this.pageComment, this.sizeComment)
        .subscribe(
          (res) => {
            this.bookComments = res;
            this.commentLoading = false;
          },
          (err) => {
            console.error("Error loading comments:", err);
            this.commentLoading = false;
          }
        );
    } else {
      console.log("none loading comments");
    }
  }

  moreComment() {
    this.sizeComment += 5;
    this.loadBookComments();
  }

  listenForBackNavigation() {
    let navigating = false;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const mainPath = this.main_class.pathComponent
          ? this.main_class.pathComponent.split("/").slice(0, -1).join("/")
          : "";
        if (event.restoredState && mainPath === "/take-libro/book" && !navigating) {
          navigating = true;
          this.indexBookId.pop();
          if (this.indexBookId.length <= 0) {
            this.router.navigateByUrl("/take-libro").then(() => {
              navigating = false;
            });
          } else {
            this.router.navigate([
              `/take-libro/book/${this.indexBookId[this.indexBookId.length - 1]}`,
            ]);
            this.loadingOnPage();
            this.loadUser();
            navigating = false;
          }
        }
      }
    });
  }
} // end

export const NG0913 = {
  provide: IMAGE_CONFIG,
  useValue: {
    disableImageSizeWarning: true,
    disableImageLazyLoadWarning: true,
  },
};
