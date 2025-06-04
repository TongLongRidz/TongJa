import { Component, Inject, inject, OnInit, PLATFORM_ID } from "@angular/core";
import { AuthService } from "../../service/auth/auth.service";
import { ProfileService } from "../../service/profile/profile-service.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from "@angular/forms";
import { interval, Subscription } from "rxjs";
import { AlertNormal } from "../../common/alert-normal/alert-normal.service";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { NotificationService } from "../../service/notification/notification.service";
import { isPlatformBrowser } from "@angular/common";
import { AlertConfirm } from "../../common/alert-confirm/alert-confirm.service";
import { I18nService } from "../../service/translate/i18n.service";
import { TranslateService } from "@ngx-translate/core";
import { ProfileByIdResetPasswordInterface } from "../../service/interface/profile";
import { Router } from "@angular/router";

export interface PageOBJ {
  label: string;
  path: string;
  role: string[];
  icon: string;
  iconColor: string;
}

declare var bootstrap: any;

@Component({
  selector: "app-book-nav",
  templateUrl: "./book-nav.component.html",
  styleUrls: ["./book-nav.component.scss"],
})
export class BookNavComponent implements OnInit {
  projectPath: "take-libro" | "take-admin" = "take-libro";
  auth = inject(AuthService);
  notiService = inject(NotificationService);
  altConfirm = inject(AlertConfirm);

  tokenName: string | null = null;
  profileData: any = {};
  editProfile: "INFO" | "EDIT" | "PWD" = "INFO";

  PWD1: boolean = false;
  PWD2: boolean = false;

  dataNoti: any[] = [];

  audio: HTMLAudioElement | null = null;

  notification: any[] = [];
  unreadNotificationsCount: number = 0;
  selectedNoti: any;

  showUnreadNotifications: boolean = false;
  notificationSubscription: Subscription | undefined;

  currentLanguage: string = "th";

  statusProjects: boolean = true;
  iconTakeLibro: string =
    "data:image/png;base64,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";
  iconTakeSome: string =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAYvSURBVHgB7Zp/TJR1HMffz/0EhbtA4ATll5hJGGCNUjMj0KBwLW1zMWvWarVM22xrNpe1bG0tmm628Ufr55xp/VENaAuXBHPosrFhuEAgfx4IRgdycMfdPT/6fJ/j4HSK9zx3xrN6Xttn9/z4Pvd839/P5/v5/rgDdHR0dHR0dHR0/oeMnF5xhu9aOYEYYoIyODIJ/xK9Tt/B5DTLPYghSgSzsjxZLVnR5LESWEPtIWshE8KuG3pPrdq2uOj4x7iuMY82DX2aYDbk3OC7uN9PrtpSeP/xr6DQAUoEM4Fus9mcUFpaCr/fDyXwPI/W1tajdPg22ftkIrt+6fyaSseg96OLR4u6sspPHQmVf7TQMXdx7oJcr0eIW7lQiD/hdHpD915/PmPhUpH/xDdYmm11NL+L28QSMkktoihKdXV1AQQ98haZIfTFL61PT+FHylkDcN1H1hVLw0+LUu9GUep+QpJ6NpJtEIWhZ4X2hjUb2XPSaLl0pr6ARRmH20g+qyyruFrIy1JDQ4N/UvSucNGs8lLgxXfEripekk5S6ROSdHbzpOCgid0bhKvDL+y97jlFKHkw6mRlNBpRWVlprq+vZ92DhfWu0L19uwqXC739u7m7dhoxWAf0fEA93XvN8xzHGRKHhl87/2vVY1DpXSUPLSXrJA+zFyMaBEFAY2NjoKqqykynA+wS/9fmBcaUbcCVRmC0AzO1r2SzwuA4VEaHx6AweSodlmIC83RFRYXZ6XSipqZmPsUvDK5LQIqRBt/fgHg74JtgLoXsE4m6t5HahvcHr12dQJzV2DThEwqpwGkoiD5VglnGNZlM6OzshM/ngxoKEt+A1fwgnqt+BGMeAZzhIHm2G7AkAPVfA4vuBvrOBoUvK6HYooZ4fDOde8EZTXjovnnoOTfyWcsPRaeSM+c8mZjRkoYIhKsSzMTabDa43W6o5Y8TJTh0+HMc/v4KAqIJ536poHD+LngzwQbk3km2mBogDvCy95hlsTKjTox7vBhw8SVffjNYsuWp+RF7WFUf3rFjB/bv3y972mBQnTCnCAT8MJ2vxlRqoHO4qGs7soLnTPAEiU0iJ06MQPKPI7CsBRaLFU1NTSgvL2elUsj+vtW7VNW2o6MDq1evjolYhtlsgZRkm74QP5e9ZPq8vQ1Iz6Vpz2XAPwYkm+RnGGVlZaFS8xEBqmrMko7Smdat8Fo/hOQeDCYoyuJybzRbg0lqxAUMdtI1AYLIQVjYPDVSsIibRIjkPbFxUQyYk5ACb8Ym8mI/ZeELQFoiCaXPcQptOyUyLlhVY8FWOYeoZdYFsyHJO3oB3Ng6xKdtB2xMDHkv6Q4KXxoBRCEomEH3ROsz1Ahr4XIeC/duxMy6YK+7EebuarhG98hh6uYySC/NJaxUNd5DLUJdJ94kXxub+7KcN8aFg7AP7MRQ/7dQyqxMPMKxzFkLTx6HO+wr5PMfL7yHYdeI3HeZuIvOfjok8WckONJs2LZJwpzENPC525GStAlKmXXB8pieVCEfsymnIeDCwKWuqftSgJ+aTRRkZsqfLBLM86rlY6VhPeuCw2HZnxdE5OUtks8NBo48fHkqI/95xY2yKOfxmhLMoNUnPJ7gjIoJZl4PEc8F5CQXzeJFM8NSiKV5LGwl2SQ5XKdnjYk2O6JFcx5eviSTJhcifvq5ldYNHvma0WRGSXE+1j98b9RLU80JZv34gYJFKMpbgFd270PA58fe3a8iNSU5arEMzQhmfZWJDREXZ8UXNW/esGxoeaoGzQhmYnNyctDX1zdjObvdjqGhIahFM4LZeEobfOjp6bnpKoxl6OzsbLms2pWaZgQzMenp6XJo36yvsjKpqanyp1o0F9JjY2MzlmOeDR+blaIZwYFAQN4yimRiwcrSLyBQg2YEs6zLto7a2tquydbhsL6blZWFAwcOQC2aEcy8ynZAZ1oMMO+r9WwITU08amtrIyoXzXxac3PpSLiJ2IhaQIlgY+hlVqs1ZjuW0RJWj4gWxkrigrYQMVFcXIz29nY4HA7k5+dHNSZGi8ViQXNzM8vabKfeFskzSgSz/k4bTqDfRCbXb7MPy2DtZFsx/Q+FmHJbf4COAq3WS0dHR0dHR0dHR+c/wz+nWcGm9ePADAAAAABJRU5ErkJggg==";

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private fb: FormBuilder,
    private alert: AlertNormal,
    private i18n: I18nService,
    private translate: TranslateService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = this.i18n.getLanguageLocal() ?? "th";
      this.audio = new Audio("./takeLibro/noti.v3.mp3");
      this.audio.load();
    }
  }

  statusProjectsFunc(page: boolean) {
    this.statusProjects = page;
    if (this.statusProjects) {
      this.router.navigateByUrl("/take-libro");
    } else {
      this.router.navigateByUrl("/take-admin");
    }
  }

  passwordForm: FormGroup = this.fb.group(
    {
      id: new FormControl(null),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmPwd: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    },
    { validators: this.passwordMatchValidator }
  );

  passwordMatchValidator(formGroup: FormGroup): null | { mismatch: boolean } {
    const password = formGroup.get("password")?.value;
    const confirmPwd = formGroup.get("confirmPwd")?.value;
    return password === confirmPwd ? null : { mismatch: true };
  }

  // prettier-ignore
  editForm: FormGroup = this.fb.group({
    id: new FormControl(null),
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    image: new FormControl(null),
    email: new FormControl(null, [Validators.required, Validators.email]),
    telephone: new FormControl(null, [this.conditionalTelephoneValidator()]),
    rule: new FormControl(null),
  });

  conditionalTelephoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value || value.trim() === "") {
        return null;
      }
      const validPattern = /^(06|08|09)[0-9]{8}$/;
      return validPattern.test(value)
        ? null
        : { pattern: "Telephone must match the pattern (06|08|09)XXXXXXXX" };
    };
  }

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile(): void {
    this.tokenName = this.authService.getToken();
    if (this.tokenName) {
      const payload = this.authService.decodeTokenJWT(this.tokenName);
      if (payload) {
        this.profileService.getProfileByIdEntity(payload.id).subscribe(
          (response) => {
            if (response && typeof response === "object") {
              this.profileData = response;
              this.getNoti();
              this.startNotificationPolling();
              // console.log('profileData :', this.profileData);

              this.editForm.patchValue({
                ...response,
                // image: response.image,
                rule:
                  response.role === "R001"
                    ? this.translate.instant("R001")
                    : response.role === "R002"
                    ? this.translate.instant("R002")
                    : response.role === "R003"
                    ? this.translate.instant("R003")
                    : "none",
              });
            } else {
              console.log("Check your type in book-nav");
            }
          },
          (error) => {
            console.error("header get Error:", error);
          }
        );
      }
    }
  }

  clearToken() {
    this.authService.clearToken();
  }

  get getToken(): boolean {
    return !!this.authService.getToken();
  }

  // prettier-ignore
  listPages: PageOBJ[] = [
    { label: 'หน้าหลัก', path: '/', role: ['R001', 'R002', 'R003'], icon: 'fa-solid fa-house', iconColor: '#B4E8C0' },
    { label: 'รายการยืมหนังสือ', path: '/borrow-book', role: ['R001', 'R003'], icon: 'fa-solid fa-list-check', iconColor: '#BBE9FF' },
    { label: 'รายการหนังสือ', path: '/books', role: ['R001', 'R003'], icon: 'fa-solid fa-book', iconColor: '#FEECB3' },
    { label: 'จัดการหมวดหมู่', path: '/categories', role: ['R001', 'R002', 'R003'], icon: 'fa-solid fa-icons', iconColor: '#E4B1F0' },
    { label: 'ประวัติการยืม', path: '/categories', role: ['R001', 'R002', 'R003'], icon: 'fa-solid fa-timeline', iconColor: '#FA8282' },
    { label: 'จัดการผู้ใช้', path: '/profile', role: ['R001', 'R003'], icon: 'fa-solid fa-user', iconColor: '#3FA2F6' },
    { label: 'รายงาน', path: '/report', role: ['R001', 'R002', 'R003'], icon: 'fa-solid fa-paste', iconColor: '#cfffe7' },
    { label: 'providers', path: '/providers', role: ['R001', 'R002', 'R003'], icon: 'fa-solid fa-paste', iconColor: '#cfffe7' }
  ];

  getNamePage(name: string): string {
    switch (name) {
      case "หน้าหลัก":
        return "home";
      case "รายการยืมหนังสือ":
        return "bookBorrowList";
      case "รายการหนังสือ":
        return "bookList";
      case "จัดการหมวดหมู่":
        return "manageCategory";
      case "ประวัติการยืม":
        return "borrowHistory";
      case "จัดการผู้ใช้":
        return "manageUsers";
      case "รายงาน":
        return "report";
      case "providers":
        return "providers";
      default:
        return "Unknown Page";
    }
  }

  onChangeEditProfile(ruleType: "EDIT" | "INFO" | "PWD") {
    if (ruleType === "EDIT") {
      this.editProfile = "EDIT";
    } else if (ruleType === "INFO") {
      this.editProfile = "INFO";
      this.getProfile();
    } else if (ruleType === "PWD") {
      this.editProfile = "PWD";
    }
  }

  onFormSubmit() {
    this.editForm.markAllAsTouched();
    if (this.editForm.valid) {
      this.profileService.editProfileEntity(this.editForm.value).subscribe(
        (res) => {
          this.getProfile();
          this.editProfile = "INFO";
          this.alert.show(this.translate.instant("updateSuccess"), "", "success");
        },
        (err) => {
          this.alert.show(
            this.translate.instant("errorOccurred") +
              " " +
              (err.status === 0 ? 404 : err.status),
            this.translate.instant("tryAgainLater"),
            "error"
          );
        }
      );
    }
  }

  onFormSubmitPWD() {
    if (this.passwordForm.valid) {
      const objReset: ProfileByIdResetPasswordInterface = {
        id: this.profileData?.id,
        password: this.passwordForm.value.password,
      };
      this.profileService.adminEditProfilePassword(objReset).subscribe(
        (res) => {
          this.alert.show(this.translate.instant("passwordUpdateSuccess"), "", "success");
          this.passwordForm.patchValue({
            password: "",
            confirmPwd: "",
          });
          this.editProfile = "EDIT";
        },
        (err) => {
          console.error("header get Error:", err);
        }
      );
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }

  isPasswordMismatchOnReset(): boolean {
    return (
      this.passwordForm.errors?.["mismatch"] &&
      (this.passwordForm.get("password")?.touched ||
        this.passwordForm.get("confirmPwd")?.touched)
    );
  }

  validFormReset(key: string): boolean {
    const control = this.editForm.get(key);
    return !!(control && control.touched && control.invalid);
  }

  statusPWD(ruleTyle: "PWD1" | "PWD2") {
    if (ruleTyle === "PWD1") {
      this.PWD1 = !this.PWD1;
    } else if (ruleTyle === "PWD2") {
      this.PWD2 = !this.PWD2;
    }
  }

  validForm2(key: string): boolean {
    const control = this.editForm.get(key);
    return !!(control && control.touched && control.invalid);
  }

  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      this.imageChangedEvent = event;

      const file: File = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64Image = reader.result as string;
        const img = new Image();
        img.src = base64Image;

        img.onload = () => {
          // console.log(`Image Width: ${img.width}px, Image Height: ${img.height}px`);

          if (img.width !== img.height || img.width > 300 || img.height > 300) {
            const cropModalElement = document.getElementById("cropModal");
            if (cropModalElement) {
              const cropModal = new bootstrap.Modal(cropModalElement);
              cropModal.show();
            }
            input.value = "";
            return;
          }

          this.editForm.patchValue({
            image: base64Image,
          });

          input.value = "";
        };
      };
      reader.readAsDataURL(file);
    }
  }

  // ---------------------------------

  imageChangedEvent: any = "";
  cropBase64: string | null | undefined = "";

  onCrop(event: ImageCroppedEvent) {
    if (event.blob) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        this.cropBase64 = base64;
      };
      reader.onerror = () => {
        console.error("Error reading blob:", reader.error);
      };
      reader.readAsDataURL(event.blob);
    } else {
      console.warn("No blob found in the event.");
    }
  }

  onSetCrop() {
    if (this.cropBase64) {
      this.editForm.patchValue({
        image: this.cropBase64,
      });
      this.cropBase64 = null;
      (document.getElementById("closeModalCrop") as HTMLElement).click();

      this.cropBase64 = "";
      this.imageChangedEvent = "";
    } else {
      console.warn("No crop base64 found.");
    }
  }

  // ----------------------------------

  startNotificationPolling() {
    this.notificationSubscription = interval(10000).subscribe(() => {
      this.getNoti();
      // console.log('log');
    });
  }

  getNoti() {
    const token = this.authService.getToken();
    if (token) {
      this.notiService.getNotifications(this.profileData.profileCode).subscribe(
        (res) => {
          const previousCount = this.unreadNotificationsCount;
          this.dataNoti = res || [];
          this.unreadNotificationsCount = this.dataNoti.filter(
            (noti) => noti.isRead === 0
          ).length;
          if (this.unreadNotificationsCount > previousCount) {
            this.playNotificationSound();
          }
        },
        (error) => {
          console.error("Error fetching notifications:", error);
        }
      );
    }
  }

  private playNotificationSound() {
    if (this.audio) {
      this.audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    } else {
      console.warn("Audio not initialized.");
    }
  }

  markIsRead(noti: any): void {
    console.log(noti);
    if (noti.isRead === 0) {
      noti.isRead = 1;
      noti.openDate = new Date();
    }

    this.notiService.isRead(noti.notiLogId).subscribe(
      (response) => {
        noti.isRead = 1;
        this.getNoti();
      },
      (error) => {
        noti.isRead = 0;
        console.error("เกิดข้อผิดพลาดในการทำเครื่องหมายแจ้งเตือนว่าอ่านแล้ว", error);
      }
    );
  }

  openDetailModal(noti: any) {
    // console.log("noti : ",noti);

    this.selectedNoti = noti;
  }

  IsReadAll(event: Event): void {
    event.stopPropagation();
    console.log("test");

    const profileCodes = this.profileData.profileCode;

    this.notiService.IsReadAll(profileCodes).subscribe(
      (response) => {
        this.dataNoti.forEach((noti) => {
          noti.isRead = 1;
          console.log("noti", noti);

          this.getNoti();
        });
        // console.log('แจ้งเตือนทั้งหมดถูกทำเครื่องหมายว่าอ่านแล้ว:', response);
      },
      (error) => {
        console.error(
          "เกิดข้อผิดพลาดในการทำเครื่องหมายแจ้งเตือนทั้งหมดว่าอ่านแล้ว",
          error
        );
      }
    );
  }

  confirmDelete(event: Event) {
    event.stopPropagation();
    if (this.dataNoti.length === 0) {
      this.alert.show(
        this.translate.instant("noNotificationsList"),
        this.translate.instant("tryAgainLater"),
        "warning"
      );
      return;
    }
    this.altConfirm
      .confirm(
        this.translate.instant("confirmDeleteAllNotifications"),
        this.translate.instant("irreversibleDelete"),
        "REMOVE"
      )
      .then((result) => {
        if (result) {
          this.deleteAll();
        }
      });
  }

  deleteAll(): void {
    const profileCodes = this.profileData.profileCode;
    this.notiService.deleteAll(profileCodes).subscribe(
      (response) => {
        this.dataNoti.forEach((noti) => {
          noti.isDelete = 1;
          this.getNoti();
        });
        // console.log('แจ้งเตือนทั้งหมดถูกลบ:', response);
      },
      (error) => {
        console.error("เกิดข้อผิดพลาดในการลบแจ้งเตือนทั้งหมด", error);
      }
    );
  }

  deleteSelecteds(): void {
    if (this.selectedNotis.length === 0) {
      this.alert.show(
        this.translate.instant("selectNotification"),
        this.translate.instant("tryAgainLater"),
        "warning"
      );
      return;
    }

    this.altConfirm
      .confirm(
        this.translate.instant("confirmDeleteNotification"),
        this.translate.instant("irreversibleChange"),
        "REMOVE"
      )
      .then((result) => {
        if (result) {
          const selectedIds = this.selectedNotis.map((noti) => noti.notiLogId);
          this.notiService.deleteSelected(selectedIds).subscribe(
            (response) => {
              this.selectedNotis.forEach((noti) => {
                noti.isDelete = 1;
              });

              this.getNoti();
              this.alert.show(
                this.translate.instant("notificationDeleted"),
                this.translate.instant("notificationDataDeleted"),
                "success"
              );
            },
            (error) => {
              console.error("เกิดข้อผิดพลาดในการลบรายการแจ้งเตือนที่เลือก", error);
              this.alert.show(
                this.translate.instant("notificationDeleteError"),
                this.translate.instant("tryAgainLater"),
                "error"
              );
            }
          );
        }
      });
  }

  onSelectNoti(noti: any, event: any): void {
    if (event.target.checked) {
      const exists = this.selectedNotis.some((n) => n.notiLogId === noti.notiLogId);
      if (!exists) {
        this.selectedNotis.push(noti);
        console.log("Selected Noti Added: ", noti);
      } else {
        console.log("This noti is already selected.");
      }

      console.log("Current selectedNotis: ", this.selectedNotis);
    } else {
      // ลบ noti ออกจาก selectedNotis
      this.selectedNotis = this.selectedNotis.filter(
        (n) => n.notiLogId !== noti.notiLogId
      );
      console.log("Selected Noti Removed: ", noti);
    }

    console.log("Total selected Notis: ", this.selectedNotis.length);
  }

  resetSelectedNotis(): void {
    this.selectedNotis = [""];
    console.log("Selected notifications have been reset.");
  }

  isNew(sendDate: Date): boolean {
    const now = new Date();
    const notificationDate = new Date(sendDate);
    const differenceInHours =
      (now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60);
    return differenceInHours <= 24;
  }

  get getDayName() {
    const today = new Date();
    const dayNamesThai = [
      "วันอาทิตย์", // Sunday
      "วันจันทร์", // Monday
      "วันอังคาร", // Tuesday
      "วันพุธ", // Wednesday
      "วันพฤหัสบดี", // Thursday
      "วันศุกร์", // Friday
      "วันเสาร์", // Saturday
    ];

    const dayNamesEnglish = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return this.getLanguages === "en"
      ? "Hello " + dayNamesEnglish[today.getDay()]
      : "สวัสดี " + dayNamesThai[today.getDay()];
  }

  selectedNotis: any[] = [];
  selectAllChecked: boolean = false;

  switchLanguage(event: Event | "th" | "en", ruleType: "EVENT" | "SET"): void {
    if (ruleType === "SET") {
      this.currentLanguage = event as "th" | "en";
      this.i18n.changeLanguage(this.currentLanguage);
    } else if (ruleType === "EVENT") {
      if (typeof event !== "string") {
        const isEnglish = (event.target as HTMLInputElement).checked;
        const selectedLanguage = isEnglish ? "en" : "th";
        this.currentLanguage = selectedLanguage;
        this.i18n.changeLanguage(selectedLanguage);
      } else {
        console.error("Expected an Event in EVENT mode but received a string");
      }
    }
  }

  get getLanguages(): string {
    return this.i18n.getLanguageLocal() || "th";
  }
}
