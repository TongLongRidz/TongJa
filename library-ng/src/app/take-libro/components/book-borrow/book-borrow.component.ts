import { Component, OnInit, ViewChild } from "@angular/core";
import { BorrowService } from "../../../service/borrow/borrow-service.service";
import { BorrowBook } from "../../../service/interface/borrow";
import { BorrowModalComponent } from "./borrow-modal/borrow-modal.component";
import { NgxSpinnerService } from "ngx-spinner";
import { I18nService } from "../../../service/translate/i18n.service";
@Component({
  selector: "app-book-borrow",
  templateUrl: "./book-borrow.component.html",
  styleUrl: "./book-borrow.component.scss",
})
export class BookBorrowComponent implements OnInit {
  // Table
  borrowBookTable: BorrowBook[] = [];
  totalPages: number = 0;
  totalElementsPage: number = 0;

  // nav page table
  pageCurrent: number = 1;
  pageSize: number = 10;
  statusSort: boolean = true;
  nameSort: "dis" | "min" | "max" = "dis";

  // loading
  loadingTable: boolean = false;
  historyDelete: boolean = false;

  // search
  searching: string = "";

  // status modal
  userBorrowID: number = 0;
  userBorrowManage: boolean = true;

  constructor(
    private borrowSvice: BorrowService,
    private spinner: NgxSpinnerService,
    private i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.loadBorrowBookTables(
      this.pageCurrent,
      this.pageSize,
      this.statusSort,
      this.nameSort,
      this.historyDelete,
      this.getLanguages
    );
  }

  // -------------- search header --------------
  onSearching() {
    if (this.searching) {
      this.changePage(1);
    } else {
      this.loadBorrowBookTables(
        1,
        this.pageSize,
        this.statusSort,
        this.nameSort,
        this.historyDelete,
        this.getLanguages
      );
    }
  }

  // -------------- table --------------
  loadBorrowBookTables(
    page: number,
    size: number,
    sort: boolean,
    sort_name: string,
    his: boolean,
    lang: string
  ): void {
    this.loadingTable = true;
    this.spinner.show();
    this.borrowSvice.getBorrowBookList(page, size, sort, sort_name, his, lang).subscribe(
      (response) => {
        this.borrowBookTable = response.content;
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
    if (this.statusSort) {
      this.borrowBookTable = this.borrowBookTable.sort((a, b) => a.id - b.id);
      this.statusSort = false;
    } else {
      this.borrowBookTable = this.borrowBookTable.sort((a, b) => b.id - a.id);
      this.statusSort = true;
    }
    this.loadBorrowBookTables(
      this.pageCurrent,
      this.pageSize,
      this.statusSort,
      this.nameSort,
      this.historyDelete,
      this.getLanguages
    );
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
      this.loadBorrowBookTables(
        this.pageCurrent,
        this.pageSize,
        this.statusSort,
        this.nameSort,
        this.historyDelete,
        this.getLanguages
      );
    }
  }

  // -------------- pagination --------------
  changePage(page: number) {
    this.pageCurrent = page;
    if (this.searching) {
      this.loadingTable = true;
      this.borrowSvice
        .postSearchBorrowBook(
          this.searching,
          this.pageCurrent,
          this.pageSize,
          this.statusSort,
          this.historyDelete,
          this.getLanguages
        )
        .subscribe(
          (response) => {
            if (!response) {
              this.borrowBookTable = [];
              this.loadingTable = false;
              this.pageCurrent = 1;
              return;
            }
            this.borrowBookTable = response.content;
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
      this.loadBorrowBookTables(
        this.pageCurrent,
        this.pageSize,
        this.statusSort,
        this.nameSort,
        this.historyDelete,
        this.getLanguages
      );
    }
  }

  loadBorrowBookTablesFromModal() {
    this.changePage(this.pageCurrent);
  }

  // -------------- manage modal --------------
  @ViewChild(BorrowModalComponent)
  bookBorrowModalComponent!: BorrowModalComponent;
  onRunModalFunc() {
    if (this.bookBorrowModalComponent) {
      this.bookBorrowModalComponent.loadBorrowBookData();
    }
  }

  get getLanguages(): string {
    return this.i18n.getLanguageLocal() || "th";
  }
} // end
