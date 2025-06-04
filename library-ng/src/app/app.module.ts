import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app/app.component";

import { defineLocale, thBeLocale, enGbLocale } from "ngx-bootstrap/chronos";
import { LoginComponent } from "./components/login/login.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { AuthInterceptorProvider } from "./service/auth/authInterceptor";
import { provideHttpClient, withFetch } from "@angular/common/http";
import { BookNavComponent } from "./components/book-nav/book-nav.component";
import { SharedModule } from "./shared/shared.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NG0913 } from "./take-libro/components/book-detail/book-detail.component";
import { PageDefaultComponent } from "./components/page-default/page-default.component";

defineLocale("th-be", thBeLocale);
defineLocale("en-be", enGbLocale);

@NgModule({
  declarations: [
    AppComponent,
    BookNavComponent,
    LoginComponent,
    PageNotFoundComponent,
    PageDefaultComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, SharedModule],

  providers: [provideHttpClient(withFetch()), AuthInterceptorProvider, NG0913],
  bootstrap: [AppComponent],
})
export class AppModule {}
