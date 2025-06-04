import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { tokenAlreadyGuard } from "./guard/token-already.guard";
import { isLoginGuard } from "./guard/is-login.guard";
import { PageDefaultComponent } from "./components/page-default/page-default.component";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "",
    component: PageDefaultComponent,
    canActivate: [isLoginGuard, tokenAlreadyGuard],
  },
  {
    path: "page-not-found",
    component: PageNotFoundComponent,
    canActivate: [isLoginGuard, tokenAlreadyGuard],
  },
  {
    path: "take-libro",
    loadChildren: () =>
      import("./take-libro/take-libro.module").then((m) => m.TakeLibroModule),
  },
  {
    path: "take-admin",
    loadChildren: () =>
      import("./take-admin/take-admin.module").then((m) => m.TakeAdminModule),
  },
  {
    path: "**",
    redirectTo: "/page-not-found",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
