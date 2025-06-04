import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-page-default",
  templateUrl: "./page-default.component.html",
  styleUrl: "./page-default.component.scss",
})
export class PageDefaultComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit(): void {
    this.router.navigateByUrl("take-libro");
  }
}
