import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TakeAdminHomeComponent } from "./components/take-admin-home/take-admin-home.component";
import { isLoginGuard } from "../guard/is-login.guard";
import { tokenAlreadyGuard } from "../guard/token-already.guard";

const routes: Routes = [
  {
    path: "",
    component: TakeAdminHomeComponent,
    canActivate: [isLoginGuard, tokenAlreadyGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TakeAdminRoutingModule {}
