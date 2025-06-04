import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BookService } from "../../../../service/book/book-service.service";
import { BookListComponent } from "../book-list.component";
import { CategoryServiceService } from "../../../../service/category/category-service.service";
import { CategoryList } from "../../../../service/interface/category";
import { AlertNormal } from "../../../../common/alert-normal/alert-normal.service";
import { TranslateService } from "@ngx-translate/core";
import { ImageCroppedEvent } from "ngx-image-cropper";

declare var bootstrap: any;

@Component({
  selector: "app-book-modal",
  templateUrl: "./book-modal.component.html",
  styleUrl: "./book-modal.component.scss",
})
export class BookModalComponent implements OnChanges {
  // status modal
  @Input() userBookID: number = 0;
  @Input() userBookManage: boolean = false;

  cacheBorrowStatus: number | null = null;
  // declare propertie
  bookImagePreview: string | ArrayBuffer | null = "./takeLibro/add-book-image.png";
  newBookForm: FormGroup = this.fb.group({
    id: new FormControl(null),
    bookCode: new FormControl(null),
    bookNameTh: new FormControl(null, [
      Validators.required,
      Validators.pattern(
        /^[ก-ฮะ-์0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+(?: [ก-ฮะ-์0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+)*$/
      ),
    ]),
    bookNameEn: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[^\s][A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]*[^\s]$/),
    ]),
    bookImage: new FormControl(null, [Validators.required]),
    bookBarCode: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^([0-9]*[A-Z]+[0-9]*)+$/), //BUG (OG: ^[A-Z0-9]+$ )
    ]),
    categoryCode: new FormControl(null, Validators.required),
    bookStatus: new FormControl(0),
  });

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private bookC: BookListComponent,
    private categoryService: CategoryServiceService,
    private alert: AlertNormal,
    private translate: TranslateService
  ) {}

  categoryList: CategoryList[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["userBookID"] &&
      !changes["userBookID"].isFirstChange() &&
      !this.userBookManage
    ) {
      if (!this.userBookManage) {
        this.loadBookData();
        this.loadCategoryData();
      }
    }
  }

  loadBookModal(): void {
    if (!this.userBookManage) {
      this.loadBookData();
      this.loadCategoryData();
    }
  }

  private loadBookData() {
    this.bookService.getBookByID(this.userBookID).subscribe(
      (response) => {
        this.newBookForm.patchValue({
          ...response,
        });
        this.cacheBorrowStatus = response.bookStatus;

        const modalElement = document.getElementById("modalManagement");
        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        this.bookC.loadingTable = false;
      },
      (error) => {
        this.alert.show(
          this.translate.instant("errorOccurred") +
            " " +
            (error.status === 0 ? 404 : error.status),
          this.translate.instant("tryAgainLater"),
          "error"
        );
        this.bookC.loadingTable = false;
      }
    );
  }

  loadCategoryData() {
    this.categoryService.getAllCategory().subscribe(
      (response) => {
        this.categoryList = response;
        this.newBookForm.patchValue({
          categoryCode: this.categoryList[0].categoryCode || null,
        });
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

  onBookStatusChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    this.newBookForm.patchValue({
      bookStatus: isChecked ? 1 : 0,
    });
  }

  onFormSubmit() {
    let active = "";
    if (this.newBookForm.value.borrowStatus !== this.cacheBorrowStatus) {
      if (this.newBookForm.value.borrowStatus === 1) {
        active = "borrow";
      } else {
        active = "return";
      }
    }

    this.newBookForm.markAllAsTouched();

    if(this.newBookForm.invalid) {
      const barcodePattern = /^([0-9]*[A-Z]+[0-9]*)+$/;
      if (!barcodePattern.test(this.newBookForm.value.bookBarCode) && this.newBookForm.value.bookBarCode) {
        this.alert.show(
          this.translate.instant("barcodeError"),
          this.translate.instant("barcodeExample"),
          "warning"
        );
        return;
      } else {
        this.alert.show(
        this.translate.instant("completeAllFields"),
        this.translate.instant("tryAgainLater"),
        "warning"
      );
      return;
      }
    }

    this.bookC.loadingTable = true;
    if (this.userBookManage) {
      this.bookService.newBook(this.newBookForm.value).subscribe(
        (response) => {
          this.alert.show(this.translate.instant("saveSuccess"), "", "success");
          (document.getElementById("closeModalButtonList") as HTMLElement).click();
          this.bookC.loadBookTablesOnManage();
          this.bookC.loadingTable = false;
        },
        (error) => {
          this.alert.show(
            this.translate.instant("errorOccurred") +
              " " +
              (error.status === 0 ? 404 : error.status),
            this.translate.instant("tryAgainLater"),
            "error"
          );
          this.bookC.loadingTable = false;
        }
      );
    } else {
      this.bookService.editBook(this.newBookForm.value, active).subscribe(
        (response) => {
          this.alert.show(this.translate.instant("updateSuccess"), "", "success");
          (document.getElementById("closeModalButtonList") as HTMLElement).click();
          this.bookC.loadBookTablesOnManage();
          this.bookC.loadingTable = false;
        },
        (error) => {
          this.alert.show(
            this.translate.instant("errorOccurred") +
              " " +
              (error.status === 0 ? 404 : error.status),
            this.translate.instant("tryAgainLater"),
            "error"
          );
          this.bookC.loadingTable = false;
        }
      );
    }
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    const file: File | undefined = input.files?.[0];

    if (input.files && input.files[0]) {
      this.imageChangedEvent = event;

      const file = input.files[0];
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = reader.result as string;
        const img = new Image();
        img.src = base64;

        img.onload = () => {
          new bootstrap.Modal(document.getElementById("cropModalBookList")).show();

          // this.newBookForm.patchValue({
          //   bookImage: base64,
          // });
          input.value = "";
        };
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById("bookImageInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  // ---------------------------------

  imageChangedEvent: any = "";
  cropBase64: string | null | undefined = "";

  onCropBookList(event: ImageCroppedEvent) {
    if (event.blob) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        this.cropBase64 = base64;
      };
      reader.onerror = () => {
        console.error("Error reading blob:", reader.error);
      };
      reader.readAsDataURL(event.blob);
    } else {
      console.warn("No blob found in the event.");
    }
  }

  onSetCropBookList() {
    this.newBookForm.patchValue({
      bookImage: this.cropBase64,
    });
    (document.getElementById("closeModalCropBookList") as HTMLElement).click();

    this.cropBase64 = "";
    this.imageChangedEvent = "";
  }

  // ---------------------------------

  resetForm() {
    this.newBookForm.reset();
    this.loadCategoryData();
  }
}
