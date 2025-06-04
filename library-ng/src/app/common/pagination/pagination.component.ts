import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() totalPages: number = 0;
  @Input() pageCurrent: number = 1;
  maxVisiblePages: number = 5;

  get pages(): number[] {
    const pages = [];

    const halfVisible = Math.floor(this.maxVisiblePages / 2);

    let startPage = Math.max(1, this.pageCurrent - halfVisible);
    let endPage = Math.min(this.totalPages, this.pageCurrent + halfVisible);

    if (endPage - startPage + 1 < this.maxVisiblePages) {
      if (this.pageCurrent <= halfVisible) {
        endPage = Math.min(
          this.totalPages,
          startPage + this.maxVisiblePages - 1
        );
      } else if (this.pageCurrent + halfVisible >= this.totalPages) {
        startPage = Math.max(1, this.totalPages - this.maxVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  onChangePage(page: number): void {
    this.pageCurrent = page;
    this.pageChange.emit(page);
  }
}
