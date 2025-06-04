import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { BookService } from "../../../service/book/book-service.service";
import { Book } from "../../../service/interface/book";
import { BookModalComponent } from "./book-modal/book-modal.component";
import { NgxSpinnerService } from "ngx-spinner";
import { I18nService } from "../../../service/translate/i18n.service";

@Component({
  selector: "app-book-list",
  templateUrl: "./book-list.component.html",
  styleUrl: "./book-list.component.scss",
})
export class BookListComponent implements OnInit {
  // Table
  bookTable: Book[] = [];
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
  userBookID: number = 0;
  userBookManage: boolean = true;

  // search
  searching: string = "";

  spinner = inject(NgxSpinnerService);

  constructor(private bookService: BookService, private i18n: I18nService) {}
  ngOnInit(): void {
    this.loadBookTables(
      this.pageCurrent,
      this.pageSize,
      this.statusSort,
      this.nameSort,
      this.historyDelete,
      this.getLanguages
    );
  }

  get getLanguages(): string {
    return this.i18n.getLanguageLocal() || "th";
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
        this.historyDelete,
        this.getLanguages
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
      this.historyDelete,
      this.getLanguages
    );
  }

  // -------------- table --------------
  loadBookTables(
    page: number,
    size: number,
    sort: boolean,
    sort_name: string,
    his: boolean,
    lang: string
  ): void {
    this.loadingTable = true;
    this.spinner.show();
    this.bookService.getBookList(page, size, sort, sort_name, his, lang).subscribe(
      (response) => {
        this.bookTable = response.content;
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
        this.historyDelete,
        this.getLanguages
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
      this.bookService
        .postSearch(
          this.searching,
          this.pageCurrent,
          this.pageSize,
          this.statusSort,
          this.nameSort,
          this.historyDelete,
          this.getLanguages
        )
        .subscribe(
          (response) => {
            if (!response) {
              this.bookTable = [];
              this.loadingTable = false;
              this.pageCurrent = 1;
              return;
            }
            this.bookTable = response.content;
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
        this.historyDelete,
        this.getLanguages
      );
    }
  }

  loadBookTablesOnManage() {
    if (this.userBookManage) {
      if (this.pageCurrent === this.totalPages) {
        this.changePage(
          this.bookTable.length === this.pageSize
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
  @ViewChild(BookModalComponent) bookModalComponent!: BookModalComponent;
  onRunModalFunc() {
    if (this.bookModalComponent) {
      this.bookModalComponent.loadBookModal();
    }
  }

  addBook() {
    this.userBookID = 0;
    this.userBookManage = true;
    if (this.bookModalComponent) {
      this.bookModalComponent.loadCategoryData();
    }
  }
} // end
