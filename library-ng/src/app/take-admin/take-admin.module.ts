import { NgModule } from "@angular/core";
import { TakeAdminRoutingModule } from "./take-admin-routing.module";
import { SharedModule } from "../shared/shared.module";
import { TakeAdminHomeComponent } from "./components/take-admin-home/take-admin-home.component";
import { TranslateService } from "@ngx-translate/core";
import { i18nOnInit, I18nService } from "../service/translate/i18n.service";

@NgModule({
  declarations: [TakeAdminHomeComponent],
  imports: [TakeAdminRoutingModule, SharedModule],
})
export class TakeAdminModule {
  constructor(private translate: TranslateService, private i18n: I18nService) {
    i18nOnInit(this.translate, this.i18n);
  }
}
