import { Component, Input } from "@angular/core";
import { AlertNormal } from "../../../../common/alert-normal/alert-normal.service";
import { AlertConfirm } from "../../../../common/alert-confirm/alert-confirm.service";
import { ProfileListComponent } from "../profile-list.component";
import { ProfileInterface } from "../../../../service/interface/profile";
import { ProfileService } from "../../../../service/profile/profile-service.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-profile-table",
  templateUrl: "./profile-table.component.html",
  styleUrl: "./profile-table.component.scss",
})
export class ProfileTableComponent {
  @Input() profileTable: ProfileInterface[] = [];
  @Input() statusSort: boolean = false;
  @Input() pageCurrent: number = 1;
  @Input() pageSize: number = 10;
  @Input() totalElementsPage: number = 0;
  @Input() loadingTable: boolean = false;
  @Input() searching: string = "";
  @Input() nameSort: string = "dis";
  @Input() historyDelete: boolean = false;
  @Input() Language: string = "th";

  constructor(
    public proComp: ProfileListComponent,
    private PRservice: ProfileService,
    private alert: AlertNormal,
    private alertConfirm: AlertConfirm,
    private translate: TranslateService
  ) {}

  // prettier-ignore
  isChangeStatusProfile(id: number | null) {
    if (!id) {
      return;
    }
    this.alertConfirm.confirm(
      this.translate.instant('confirmDelete'),
      this.translate.instant('irreversibleDelete'),
      'REMOVE'
    ).then((result) => {
      if (result) {
        this.PRservice.deleteProfileByID(id).subscribe(
          (response) => {
            this.proComp.changePage(
              this.profileTable.length === 1
                ? this.totalElementsPage === 1
                  ? this.pageCurrent
                  : this.searching
                  ? this.pageCurrent
                  : this.pageCurrent - 1
                : this.pageCurrent
            );
            this.alert.show(this.translate.instant('deleteSuccess'), '', 'success');
          },
          (error) => {
            this.alert.show(
              this.translate.instant('errorOccurred') + ' ' + (error.status === 0 ? 404 : error.status),
              this.translate.instant('tryAgainLater'),
              'error'
            );
          }
        );
      }
    });
  }

  // prettier-ignore
  forDate(date: string, lang: string): string {
    const dateObj = new Date(date);
    const monthsThai = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
    ];
    const monthsEnglish = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return lang === 'en' ? `${monthsEnglish[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}` : `วันที่ ${dateObj.getDate()} ${monthsThai[dateObj.getMonth()]} ${dateObj.getFullYear() + 543}`;
  }

  getUserById(id: number) {
    this.proComp.loadingTable = true;
    if (id === this.proComp.userUserId) {
      return this.proComp.onRunModalFunc();
    }
    this.proComp.userUserId = id;
    this.proComp.userProfileManage = false;
  }
} // end
