import { Component, OnInit, ViewChild } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ProfileModalComponent } from "./profile-modal/profile-modal.component";
import { ProfileInterface } from "../../../service/interface/profile";
import { ProfileService } from "../../../service/profile/profile-service.service";
import { I18nService } from "../../../service/translate/i18n.service";

@Component({
  selector: "app-book-list",
  templateUrl: "./profile-list.component.html",
  styleUrl: "./profile-list.component.scss",
})
export class ProfileListComponent implements OnInit {
  // Table
  profileTable: ProfileInterface[] = [];
  totalPages: number = 0;
  totalElementsPage: number = 0;

  // nav page table
  pageCurrent: number = 1;
  pageSize: number = 10;
  statusSort: boolean = true;
  nameSort: string = "dis";

  // loading
  loadingTable: boolean = false;

  // status modal
  userUserId: number = 0;
  userProfileManage: boolean = true;

  // search
  searching: string = "";
  constructor(
    private proService: ProfileService,
    private spin: NgxSpinnerService,
    private i18n: I18nService
  ) {}
  ngOnInit(): void {
    this.loadBookTables(
      this.pageCurrent,
      this.pageSize,
      this.statusSort,
      this.nameSort,
      this.historyDelete
    );
  }

  // -------------- search header --------------
  onSearching() {
    // code for search...
    if (this.searching) {
      this.changePage(1);
    } else {
      this.loadBookTables(
        1,
        this.pageSize,
        this.statusSort,
        this.nameSort,
        this.historyDelete
      );
    }
  }

  // -------------- view delete --------------
  historyDelete: boolean = false;
  onSelectChangeHistory(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.historyDelete = selectElement.value === "true";
    this.loadBookTables(
      this.pageCurrent,
      this.pageSize,
      this.statusSort,
      this.nameSort,
      this.historyDelete
    );
  }

  // -------------- table --------------
  loadBookTables(
    page: number,
    size: number,
    sort: boolean,
    sort_name: string,
    his: boolean
  ): void {
    this.loadingTable = true;
    this.spin.show();
    this.proService.getProfileList(page, size, sort, sort_name, his).subscribe(
      (response) => {
        this.profileTable = response.content;
        this.totalPages = response.totalPages;
        this.totalElementsPage = response.totalElements;
        this.loadingTable = false;
      },
      (error) => {
        console.error("Error loading books:", error);
        this.loadingTable = false;
      }
    );
  }
  sortTable() {
    this.nameSort = "dis";
    this.statusSort = !this.statusSort;
    if (this.searching) {
      this.changePage(1);
    } else {
      this.loadBookTables(
        this.pageCurrent,
        this.pageSize,
        this.statusSort,
        this.nameSort,
        this.historyDelete
      );
    }
  }

  sortNameFunc() {
    this.statusSort = true;
    if (this.nameSort == "dis" || this.nameSort == "max") {
      this.nameSort = "min";
    } else {
      this.nameSort = "max";
    }
    if (this.searching) {
      this.changePage(1);
    } else {
      this.loadBookTables(
        this.pageCurrent,
        this.pageSize,
        this.statusSort,
        this.nameSort,
        this.historyDelete
      );
    }
  }

  // -------------- pagination --------------
  changePage(page: number) {
    this.pageCurrent = page;
    if (this.searching) {
      this.loadingTable = true;
      this.proService
        .postProfileSearch(
          this.searching,
          this.pageCurrent,
          this.pageSize,
          this.statusSort,
          this.nameSort,
          this.historyDelete
        )
        .subscribe(
          (response) => {
            if (!response) {
              this.profileTable = [];
              this.loadingTable = false;
              this.pageCurrent = 1;
              return;
            }
            this.profileTable = response.content;
            this.totalPages = response.totalPages;
            this.totalElementsPage = response.totalElements;
            this.loadingTable = false;
          },
          (error) => {
            console.error("Error searching books:", error);
            this.loadingTable = false;
          }
        );
    } else {
      this.loadBookTables(
        this.pageCurrent,
        this.pageSize,
        this.statusSort,
        this.nameSort,
        this.historyDelete
      );
    }
  }

  loadBookTablesOnManage() {
    if (this.userProfileManage) {
      if (this.pageCurrent === this.totalPages) {
        this.changePage(
          this.profileTable.length === this.pageSize
            ? this.pageCurrent + 1
            : this.pageCurrent
        );
      } else {
        this.changePage(
          this.totalElementsPage % this.pageSize === 0
            ? this.totalPages + 1
            : this.totalPages
        );
      }
    } else {
      this.changePage(this.pageCurrent);
    }
  }

  // -------------- modal --------------
  @ViewChild(ProfileModalComponent)
  profileModalComponent!: ProfileModalComponent;
  onRunModalFunc() {
    if (this.profileModalComponent) {
      this.profileModalComponent.loadProfileModal();
    }
  }

  onResetFormModalFunc() {
    if (this.profileModalComponent) {
      this.profileModalComponent.formAddisReset();
    }
  }

  AddUserStatus() {
    this.userUserId = 0;
    this.userProfileManage = true;
    this.onResetFormModalFunc();
  }

  get getLanguages(): string {
    return this.i18n.getLanguageLocal() || "th";
  }
} // end
