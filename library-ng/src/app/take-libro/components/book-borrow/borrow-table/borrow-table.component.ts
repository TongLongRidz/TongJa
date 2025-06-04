import { Component, Input } from "@angular/core";
import { BorrowBook } from "../../../../service/interface/borrow";
import { BorrowService } from "../../../../service/borrow/borrow-service.service";
import { BookBorrowComponent } from "../book-borrow.component";
import { AlertConfirm } from "../../../../common/alert-confirm/alert-confirm.service";
import { AlertNormal } from "../../../../common/alert-normal/alert-normal.service";
import { TranslateService } from "@ngx-translate/core";
import { FormatDateService } from "../../../../common/format-date-time/format-date.service";

@Component({
  selector: "app-borrow-table",
  templateUrl: "./borrow-table.component.html",
  styleUrl: "./borrow-table.component.scss",
})
export class BorrowTableComponent {
  @Input() borrowBookTable: BorrowBook[] = [];
  @Input() statusSort: boolean = false;
  @Input() pageCurrent: number = 1;
  @Input() pageSize: number = 10;
  @Input() totalElementsPage: number = 0;
  @Input() loadingTable: boolean = false;
  @Input() searching: String = "";
  @Input() nameSort: "dis" | "min" | "max" = "dis";
  @Input() Language: string = "th";

  constructor(
    private borrowService: BorrowService,
    public borrowCom: BookBorrowComponent,
    private alert: AlertNormal,
    private altConfirm: AlertConfirm,
    private translate: TranslateService,
    public formatDateService: FormatDateService
  ) {}

  editBorrowBook(id: number) {
    this.borrowCom.loadingTable = true;
    if (id === this.borrowCom.userBorrowID) {
      return this.borrowCom.onRunModalFunc();
    }
    this.borrowCom.userBorrowID = id;
  }

  isChangeStatusBook(id: number | null) {
    if (!id) {
      return;
    }

    this.altConfirm
      .confirm(
        this.translate.instant("confirmDelete"),
        this.translate.instant("irreversibleDelete"),
        "REMOVE"
      )
      .then((result) => {
        if (result) {
          this.borrowService.deleteStatusBorrowBook(id).subscribe(
            (response) => {
              this.borrowCom.changePage(
                this.borrowBookTable.length === 1
                  ? this.totalElementsPage === 1
                    ? this.pageCurrent
                    : this.searching
                    ? this.pageCurrent
                    : this.pageCurrent - 1
                  : this.pageCurrent
              );
              this.alert.show(this.translate.instant("deleteSuccess"), "", "success");
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
      });
  }
} // end
