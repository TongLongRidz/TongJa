import { Component, Input, ViewChild } from "@angular/core";
import { Book } from "../../../../service/interface/book";
import { BookListComponent } from "../book-list.component";
import { BookService } from "../../../../service/book/book-service.service";
import { AlertConfirm } from "../../../../common/alert-confirm/alert-confirm.service";
import { AlertNormal } from "../../../../common/alert-normal/alert-normal.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-book-table",
  templateUrl: "./book-table.component.html",
  styleUrl: "./book-table.component.scss",
})
export class BookTableComponent {
  @Input() bookTable: Book[] = [];
  @Input() statusSort: boolean = false;
  @Input() pageCurrent: number = 1;
  @Input() pageSize: number = 10;
  @Input() totalElementsPage: number = 0;
  @Input() loadingTable: boolean = false;
  @Input() searching: string = "";
  @Input() nameSort: string = "dis";
  @Input() historyDelete: boolean = false;
  @Input() Language: string = "th";

  constructor(
    public bookC: BookListComponent,
    private bookService: BookService,
    private alert: AlertNormal,
    private alertConfirm: AlertConfirm,
    private translate: TranslateService
  ) {}

  editBook(id: number) {
    this.bookC.loadingTable = true;
    if (id === this.bookC.userBookID) {
      return this.bookC.onRunModalFunc();
    }
    this.bookC.userBookID = id;
    this.bookC.userBookManage = false;
  }

  // prettier-ignore
  isChangeStatusBook(id: number | null) {
    if (!id) {
      return;
    }
    this.alertConfirm.confirm(
      this.translate.instant('confirmDelete'),
      this.translate.instant('irreversibleDelete'),
      'REMOVE'
    ).then((result) => {
      if (result) {
        const action = this.historyDelete ? 'reDeleteStatusBook' : 'deleteStatusBook';
        this.bookService[action](id).subscribe(
          () => {
            const newPage = this.bookTable.length === 1
              ? this.totalElementsPage === 1
                ? this.pageCurrent
                : this.searching
                ? this.pageCurrent
                : this.pageCurrent - 1
              : this.pageCurrent;
            this.bookC.changePage(newPage);
            this.alert.show(
              this.historyDelete ? this.translate.instant('restoreSuccess') : this.translate.instant('deleteSuccess'),
              "", "success"
            );
          },
          (error) => {
            this.alert.show(
              this.translate.instant('errorOccurred') + " " + (error.status === 0 ? 404 : error.status),
              this.translate.instant('tryAgainLater'), "error"
            );
          }
        );
      }
    });
  }
}
