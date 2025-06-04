import { Component } from "@angular/core";
import { AlertNormal } from "../../../common/alert-normal/alert-normal.service";

@Component({
  selector: "app-take-admin-home",
  templateUrl: "./take-admin-home.component.html",
  styleUrl: "./take-admin-home.component.scss",
})
export class TakeAdminHomeComponent {
  constructor(private sweet: AlertNormal) {}

  onClick() {
    this.sweet.show("Title", "Description", "success");
  }
}
