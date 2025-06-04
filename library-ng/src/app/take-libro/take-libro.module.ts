import { NgModule } from "@angular/core";

import { TakeLibroRoutingModule } from "./take-libro-routing.module";
import { SharedModule } from "../shared/shared.module";
import { TranslateService } from "@ngx-translate/core";
import { i18nOnInit, I18nService } from "../service/translate/i18n.service";
import { HomeComponent } from "./components/home/home.component";
import { BookDetailComponent } from "./components/book-detail/book-detail.component";
import { BookListComponent } from "./components/book-list/book-list.component";
import { BookBorrowComponent } from "./components/book-borrow/book-borrow.component";
import { CategoryListComponent } from "./components/category-list/category-list.component";
import { BookModalComponent } from "./components/book-list/book-modal/book-modal.component";
import { BookTableComponent } from "./components/book-list/book-table/book-table.component";
import { BorrowModalComponent } from "./components/book-borrow/borrow-modal/borrow-modal.component";
import { BorrowTableComponent } from "./components/book-borrow/borrow-table/borrow-table.component";
import { HistoryListComponent } from "./components/history-list/history-list.component";
import { MyHistoryComponent } from "./components/my-history/my-history.component";
import { MyListborrowComponent } from "./components/my-listborrow/my-listborrow.component";
import { ProfileListComponent } from "./components/profile-list/profile-list.component";
import { ProfileModalComponent } from "./components/profile-list/profile-modal/profile-modal.component";
import { ProfileTableComponent } from "./components/profile-list/profile-table/profile-table.component";
import { ReportComponent } from "./components/report/report.component";
import { FavoriteComponent } from "./components/favorite/favorite.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { ProvidersComponent } from './components/providers/providers.component';

@NgModule({
  declarations: [
    HomeComponent,
    BookDetailComponent,
    BookListComponent,
    BookBorrowComponent,
    CategoryListComponent,
    BookModalComponent,
    BookTableComponent,
    BorrowModalComponent,
    BorrowTableComponent,
    HistoryListComponent,
    MyHistoryComponent,
    MyListborrowComponent,
    ProfileListComponent,
    ProfileModalComponent,
    ProfileTableComponent,
    ReportComponent,
    FavoriteComponent,
    DashboardComponent,
    ProvidersComponent,
  ],
  imports: [TakeLibroRoutingModule, SharedModule],
})
export class TakeLibroModule {
  constructor(private translate: TranslateService, private i18n: I18nService) {
    i18nOnInit(this.translate, this.i18n);
  }
}
