import { Component, HostListener, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { I18nService, i18nOnInit } from "../service/translate/i18n.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "library";
  showNav = true;
  stars = Array(15).fill(0);
  pathComponent: string | null = null;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private i18n: I18nService
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNav = !event.url.includes("/login");
        this.pathComponent = this.router.url;
      }
    });

    i18nOnInit(this.translate, this.i18n);
  }
}
