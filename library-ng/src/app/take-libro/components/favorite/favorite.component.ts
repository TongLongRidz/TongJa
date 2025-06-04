import { Component, inject, OnInit } from "@angular/core";
import { FavoriteServiceService } from "../../../service/favorite/favorite-service.service";
import { AuthService } from "../../../service/auth/auth.service";
import { ProfileService } from "../../../service/profile/profile-service.service";
import { BookEntity } from "../../../service/interface/favorite";
import { Router } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { BookService } from "../../../service/book/book-service.service";
import { AlertConfirm } from "../../../common/alert-confirm/alert-confirm.service";
import { TranslateService } from "@ngx-translate/core";
import { AlertNormal } from "../../../common/alert-normal/alert-normal.service";

@Component({
  selector: "app-favorite",
  templateUrl: "./favorite.component.html",
  styleUrl: "./favorite.component.scss",
})
export class FavoriteComponent implements OnInit {
  favoriteBooks: BookEntity[] = [];

  profileData: any;
  profileName: string = "";
  tokenName: string | null = null;

  page: number = 1;
  size: number = 6;
  loadingTable: boolean = false;

  showNoResultsMessage: boolean = false;
  totalElements: number = 0;
  totalPages: number = 0;

  dataFavorite: any[] = [];
  dataListCatFavorite: any[] = [];
  selectedCategory: string | null = null;
  favoriteCount: number = 0;
  borrowCounts: { [key: string]: number } = {};
  favoriteStatus: boolean = false;

  favoriteService = inject(FavoriteServiceService);
  authService = inject(AuthService);
  profileService = inject(ProfileService);
  router = inject(Router);
  spinner = inject(NgxSpinnerService);
  bookService = inject(BookService);
  altConfirm = inject(AlertConfirm);
  translate = inject(TranslateService);
  alert = inject(AlertNormal);

  totalBorrowedCount: number = 0;
  favoriteCategories: string[] = [];
  currentBookName: string = "";

  constructor() {}

  searchForm = new FormGroup({
    search: new FormControl(null),
    category: new FormControl(null),
  });

  ngOnInit(): void {
    this.getProfile();
    this.searchForm.valueChanges.subscribe(() => {
      this.page = 1;
      this.searchGet();
      this.loadingTable = false;
    });
  }

  onCategoryClick(categoryCode: any): void {
    this.selectedCategory = categoryCode;
    this.searchGet();
    console.log(this.searchForm.value);
  }

  searchGet(): void {
    this.onGetdata();
  }

  onGetdata(): void {
    this.loadingTable = true;
    this.spinner.show();

    const searchValue = this.searchForm.get("search")?.value || "";
    const searchCate =
      this.selectedCategory || this.searchForm.get("category")?.value || "";

    this.favoriteService
      .searchGetCategory(
        searchValue,
        this.profileData.profileCode,
        searchCate,
        this.page,
        this.size
      )
      .subscribe(
        (res: any) => {
          this.dataFavorite = res?.content ?? [];
          if (this.dataFavorite.length === 0) {
            this.showNoResultsMessage = true;
          } else {
            this.totalElements = res?.totalElements ?? 0;
            this.totalPages = res.totalPages;
            this.showNoResultsMessage = false;
          }
          this.loadingTable = false;
        },
        (error) => {
          console.error("Error fetching data:", error);
          this.loadingTable = false;
        }
      );
  }

  getListCategoryFavorite() {
    this.favoriteService.listCategorybyfavorite(this.profileData.profileCode).subscribe(
      (data) => {
        this.dataListCatFavorite = data.favoriteCategories;
        this.favoriteCount = data.favoriteCount;
        // console.log("Favorite Categories:", this.dataListCatFavorite);
        // console.log("favoriteCount:", this.favoriteCount);
      },
      (error) => {
        console.error("Error fetching liked categories:", error);
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
            // this.getDataFavorites();
            this.onGetdata();
            this.getListCategoryFavorite();
          },
          (error) => {
            console.error("header get Error:", error);
          }
        );
      }
    }
  }

  bookDetail(id: number) {
    this.router.navigate(["/book", id]);
  }

  onPageChange(page: number): void {
    this.page = page;
    this.searchGet();
  }

  resetForm(): void {
    this.searchForm.reset({
      search: null,
      category: null,
    });
    // this.dataListCatFavorite = [];
    this.selectedCategory = "";
    this.page = 1;
    this.onGetdata();
  }

  confirmDelete(bookCode: string) {
    this.altConfirm
      .confirm(
        this.translate.instant("cancel_favorite"),
        this.translate.instant("confirm_cancel_favorite"),
        "REMOVE"
      )
      .then((result) => {
        if (result) {
          this.toggleDeleteFavorite(bookCode);
        }
      });
  }

  toggleDeleteFavorite(bookCode: string): void {
    this.favoriteService
      .deleteFavorite(bookCode, this.profileData.profileCode)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.favoriteStatus = !this.favoriteStatus;
          this.alert.show(
            this.translate.instant("cancel_favorite_success"),
            "",
            "success"
          );
          this.onGetdata();
          this.getListCategoryFavorite();
        },
        error: (err) => {
          this.alert.show(
            this.translate.instant("cancel_favorite_failed") + " ",
            this.translate.instant("tryAgainLater"),
            "error"
          );
        },
      });
  }
}
