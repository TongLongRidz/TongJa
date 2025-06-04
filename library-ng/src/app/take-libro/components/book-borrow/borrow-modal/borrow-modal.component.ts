import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { BorrowService } from "../../../../service/borrow/borrow-service.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { BookBorrowComponent } from "../book-borrow.component";
import { AlertNormal } from "../../../../common/alert-normal/alert-normal.service";
import { TranslateService } from "@ngx-translate/core";
import { FormatDateService } from "../../../../common/format-date-time/format-date.service";

declare var bootstrap: any;
@Component({
  selector: "app-borrow-modal",
  templateUrl: "./borrow-modal.component.html",
  styleUrl: "./borrow-modal.component.scss",
})
export class BorrowModalComponent implements OnChanges {
  constructor(
    private borrowSviceL: BorrowService,
    private fb: FormBuilder,
    private borrowCom: BookBorrowComponent,
    private alert: AlertNormal,
    private translate: TranslateService,
    private formatDateService: FormatDateService
  ) {}

  @Input() userBorrowID: number = 0;
  @Input() Language: string = "th";

  defaultBorrowStart: Date = new Date();
  waitUpdateBorrowEnd: Date = new Date();
  minDate: Date = new Date();

  cacheBorrowEnd: Date = new Date();
  cacheBorrowStatus: number = 0;

  isDisabled: boolean = true;

  newBorrowForm: FormGroup = this.fb.group({
    id: new FormControl(null),
    borrowerName: new FormControl(null),
    bookNameTh: new FormControl(null),
    bookNameEn: new FormControl(null),
    borrowStart: new FormControl(null),
    borrowEnd: new FormControl(null),
    borrowStatus: new FormControl({ value: 0, disabled: true }),
    active: new FormControl(null),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["userBorrowID"] && !changes["userBorrowID"].isFirstChange()) {
      this.loadBorrowBookData();
    }
  }

  loadBorrowBookData() {
    if (this.userBorrowID != 0) {
      this.borrowSviceL.getBorrowBookByID(this.userBorrowID).subscribe(
        (response) => {
          this.newBorrowForm.patchValue({
            ...response,
            borrowerName: response.firstName + " " + response.lastName,
            borrowStart: this.formatDateService.forDate(
              response.borrowStart,
              "MIN",
              "NO-TIME",
              this.Language
            ),
            borrowEnd: this.formatDateService.forDate(
              response.borrowEnd,
              "MIN",
              "NO-TIME",
              this.Language
            ),
          });
          this.defaultBorrowStart = new Date(response.borrowStart);
          this.waitUpdateBorrowEnd = new Date(response.borrowEnd);

          this.cacheBorrowEnd = new Date(response.borrowEnd);
          this.cacheBorrowStatus = response.borrowStatus;

          const modalElement = document.getElementById("modalManagementBorrow");
          const modal = new bootstrap.Modal(modalElement);
          modal.show();

          this.borrowCom.loadingTable = false;
        },
        (error) => {
          this.alert.show(
            this.translate.instant("errorOccurred") +
              " " +
              (error.status === 0 ? 404 : error.status),
            this.translate.instant("tryAgainLater"),
            "error"
          );
          this.borrowCom.loadingTable = false;
        }
      );
    }
  }

  onDateSelected(selectedDate: Date): void {
    this.waitUpdateBorrowEnd = new Date(selectedDate);
  }

  toggleBookStatus(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.newBorrowForm.get("borrowStatus")?.setValue(Number(selectedValue));
  }

  // prettier-ignore
  get cacheForm(): boolean {
    const sameDay = this.cacheBorrowEnd.getDate() === this.waitUpdateBorrowEnd.getDate();
    const sameMonth = this.cacheBorrowEnd.getMonth() === this.waitUpdateBorrowEnd.getMonth();
    const sameYear = this.cacheBorrowEnd.getFullYear() === this.waitUpdateBorrowEnd.getFullYear();
  
    return (this.cacheBorrowStatus === this.newBorrowForm.value.borrowStatus && sameDay && sameMonth && sameYear);
  }

  onBorrowStatusChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    this.newBorrowForm.patchValue({
      borrowStatus: isChecked ? 1 : 0,
    });
  }

  onFormSubmit() {
    this.newBorrowForm.markAllAsTouched();
    if (this.newBorrowForm.invalid) {
      this.alert.show(
        this.translate.instant("completeAllFields"),
        this.translate.instant("tryAgainLater"),
        "warning"
      );
      return;
    }

    let active = "";
    if (this.newBorrowForm.value.borrowStatus !== this.cacheBorrowStatus) {
      if (this.newBorrowForm.value.borrowStatus === 1) {
        active = "borrow";
      } else {
        active = "return";
      }
    } else if (this.waitUpdateBorrowEnd.getTime() !== this.cacheBorrowEnd.getTime()) {
      active = "slip";
    }
    this.newBorrowForm.patchValue({
      borrowStart: this.defaultBorrowStart,
      borrowEnd: this.waitUpdateBorrowEnd,
      active: active,
    });

    console.log("active", active);

    this.borrowSviceL.editBorrowBook(this.newBorrowForm.value).subscribe(
      (response) => {
        this.alert.show(this.translate.instant("updateSuccess"), "", "success");
        (document.getElementById("closeModalButtonBorrow") as HTMLElement).click();
        this.borrowCom.loadBorrowBookTablesFromModal();
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
} // end
