import { Component, inject, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { CategoryServiceService } from "../../../service/category/category-service.service";
import { Observable } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertConfirm } from "../../../common/alert-confirm/alert-confirm.service";
import { AlertNormal } from "../../../common/alert-normal/alert-normal.service";
import { threadId } from "worker_threads";
import { TranslateService } from "@ngx-translate/core";

CategoryServiceService;
@Component({
  selector: "app-category-list",
  templateUrl: "./category-list.component.html",
  styleUrl: "./category-list.component.scss",
})
export class CategoryListComponent implements OnInit {
  @Input() statusSort: boolean = false;

  isEditMode: boolean = false;
  private modalRef: NgbModalRef | null = null;
  loadingTable: boolean = false;

  // search
  keyword: string = "";
  dataCategory: any[] = [];
  content = [];

  searchForm = new FormGroup({
    search: new FormControl(""),
  });

  // pagination
  page: number = 1;
  size = 10;
  Sort: boolean = true;

  showNoResultsMessage: boolean = false;
  totalElements: number = 0;
  categoryList: any[] = [];
  totalPages: number = 0;

  isLoading: boolean = false;
  categoryCodesInUse: any[] = [];
  isCategoryInUse: boolean = false;

  categoryForm!: FormGroup;

  categoryService = inject(CategoryServiceService);
  modalService = inject(NgbModal);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  spinner = inject(NgxSpinnerService);

  constructor(
    private alert: AlertNormal,
    private altConfirm: AlertConfirm,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadCategoryCodesInUse();
    this.onGetdata();
    this.categoryForm = this.formBuilder.group({
      id: [""],
      categoryCode: [""],
      categoryName: ["", [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    });
  }

  onInputChange(event: any) {
    const value = event.target.value;
    this.categoryForm.value.categoryName = value.replace(/\s/g, "");
  }

  getCategorydata(): Observable<any[]> {
    return this.categoryService.getAllCategory();
  }

  searchGet(data: any): void {
    this.page = 1;
    this.onGetdata();
  }

  onGetdata(): void {
    this.loadingTable = true;
    this.spinner.show();
    const searchValue = this.searchForm.get("search")?.value || "";
    this.categoryService
      .searchGetCategory(searchValue, this.page, this.size, this.Sort)
      .subscribe(
        (res: any) => {
          this.dataCategory = res?.content ?? [];
          if (this.dataCategory.length === 0) {
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

  openAddModal() {
    this.resetModal();
    this.isEditMode = false;
    this.categoryForm.reset();
  }

  openEditModal(category: any) {
    this.resetModal();
    this.isEditMode = true;
    this.categoryForm.patchValue(category);
  }

  toggleSort(): void {
    if (this.Sort) {
      this.categoryList = this.categoryList.sort((a, b) => a.id - b.id);
      this.Sort = false;
    } else {
      this.categoryList = this.categoryList.sort((a, b) => b.id - a.id);
      this.Sort = true;
    }
    this.onGetdata();
  }

  onSubmit() {
    this.isLoading = true;

    if (this.categoryForm.invalid) {
      this.alert.show(
        this.translate.instant("completeAllFields"),
        this.translate.instant("tryAgainLater"),
        "warning"
      );
      return;
    }

    this.getCategorydata().subscribe(
      (categories) => {
        const categoryExists = categories.some(
          (cat) =>
            cat.categoryName.toLowerCase() ===
              this.categoryForm.value.categoryName.toLowerCase() &&
            cat.categoryCode !== this.categoryForm.value.categoryCode
        );
        if (categoryExists) {
          this.alert.show(
            this.translate.instant("dataExists"),
            this.translate.instant("tryAgainLater"),
            "warning"
          );
          this.onGetdata();
          return;
        }
        if (this.isEditMode) {
          this.categoryService
            .updateCategory(this.categoryForm.value.id, this.categoryForm.value)
            .subscribe(
              (response) => {
                this.alert.show(this.translate.instant("updateSuccess"), "", "success");
                this.onGetdata();
                (
                  document.getElementById("closeModalButtonCategory") as HTMLElement
                ).click();
              },
              (error) => {
                this.alert.show(
                  this.translate.instant("errorOccurred") +
                    " " +
                    (error.status === 0 ? 404 : error.status),
                  this.translate.instant("tryAgainLater"),
                  "error"
                );
                this.onGetdata();
              }
            );
        } else {
          this.categoryService.addCategory(this.categoryForm.value).subscribe(
            (response) => {
              this.alert.show(this.translate.instant("saveSuccess"), "", "success");
              (
                document.getElementById("closeModalButtonCategory") as HTMLElement
              ).click();
              this.onGetdata();
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

  confirmDelete(category: any) {
    this.altConfirm
      .confirm(
        this.translate.instant("confirmDelete"),
        this.translate.instant("irreversibleDelete"),
        "REMOVE"
      )
      .then((result) => {
        if (result) {
          this.deleteCategory(category);
        }
      });
  }

  loadCategoryCodesInUse() {
    this.categoryService.getAllCategoryCodesInUse().subscribe((codes: string[]) => {
      this.categoryCodesInUse = codes;
    });
  }

  checkNgIfRemoveOne(categoryCode: string): boolean {
    return !this.categoryCodesInUse.includes(categoryCode);
  }

  deleteCategory(category: any) {
    this.categoryService.deleteCategory(category.id).subscribe(
      (response) => {
        this.getCategorydata();
        this.alert.show(this.translate.instant("deleteSuccess"), "", "success");
        this.onGetdata();
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

  onPageChange(page: number): void {
    this.page = page;
    this.loadingTable = false;
    this.onGetdata();
  }

  resetModal() {
    this.isEditMode = false;
    // this.selectedCategory = {
    //   categoryCode: '',
    //   categoryName: '',
    //   isDelete: '',
    // };
  }
}
