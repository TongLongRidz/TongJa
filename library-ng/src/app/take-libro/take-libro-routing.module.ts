import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { isLoginGuard } from "../guard/is-login.guard";
import { tokenAlreadyGuard } from "../guard/token-already.guard";
import { roleUserGuard } from "../guard/role-user.guard";
import { bookDetailGuard } from "../guard/book-detail.guard";
import { HomeComponent } from "./components/home/home.component";
import { ProfileListComponent } from "./components/profile-list/profile-list.component";
import { BookDetailComponent } from "./components/book-detail/book-detail.component";
import { HistoryListComponent } from "./components/history-list/history-list.component";
import { BookListComponent } from "./components/book-list/book-list.component";
import { BookBorrowComponent } from "./components/book-borrow/book-borrow.component";
import { CategoryListComponent } from "./components/category-list/category-list.component";
import { MyHistoryComponent } from "./components/my-history/my-history.component";
import { MyListborrowComponent } from "./components/my-listborrow/my-listborrow.component";
import { ReportComponent } from "./components/report/report.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { FavoriteComponent } from "./components/favorite/favorite.component";
import { ProvidersComponent } from "./components/providers/providers.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    canActivate: [isLoginGuard, tokenAlreadyGuard],
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [isLoginGuard, tokenAlreadyGuard],
  },
  {
    path: "profile",
    component: ProfileListComponent,
    canActivate: [isLoginGuard, roleUserGuard, tokenAlreadyGuard],
  },
  {
    path: "book/:id",
    component: BookDetailComponent,
    canActivate: [bookDetailGuard, isLoginGuard, tokenAlreadyGuard],
  },
  {
    path: "history",
    component: HistoryListComponent,
    canActivate: [isLoginGuard, tokenAlreadyGuard],
  },
  {
    path: "books",
    component: BookListComponent,
    canActivate: [isLoginGuard, tokenAlreadyGuard],
  },
  {
    path: "borrow-book",
    component: BookBorrowComponent,
    canActivate: [isLoginGuard, roleUserGuard, tokenAlreadyGuard],
  },
  {
    path: "categories",
    component: CategoryListComponent,
    canActivate: [isLoginGuard, roleUserGuard, tokenAlreadyGuard],
  },
  {
    path: "my-history",
    component: MyHistoryComponent,
    canActivate: [isLoginGuard, tokenAlreadyGuard],
  },
  {
    path: "my-borrows-list",
    component: MyListborrowComponent,
    canActivate: [isLoginGuard, tokenAlreadyGuard],
  },
  {
    path: "report",
    component: ReportComponent,
    canActivate: [isLoginGuard],
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [isLoginGuard],
  },
  {
    path: "favorite",
    component: FavoriteComponent,
    canActivate: [isLoginGuard],
  },
  {
    path: "providers",
    component: ProvidersComponent,
    canActivate: [isLoginGuard, tokenAlreadyGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TakeLibroRoutingModule {}
