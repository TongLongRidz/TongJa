import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from "@angular/forms";
import { ProfileService } from "../../../../service/profile/profile-service.service";
import {
  ProfileByIdResetPasswordInterface,
  ProfileEditInterface,
} from "../../../../service/interface/profile";
import { AlertNormal } from "../../../../common/alert-normal/alert-normal.service";
import { RegisterServiceService } from "../../../../service/register/register-service.service";
import { switchMap } from "rxjs";
import { ProfileListComponent } from "../profile-list.component";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "../../../../service/auth/auth.service";
import { AlertConfirm } from "../../../../common/alert-confirm/alert-confirm.service";
import { Router } from "@angular/router";

declare var bootstrap: any;

@Component({
  selector: "app-profile-modal",
  templateUrl: "./profile-modal.component.html",
  styleUrl: "./profile-modal.component.scss",
})
export class ProfileModalComponent implements OnChanges {
  // status modal
  @Input() userUserId: number = 0;
  @Input() userProfileManage: boolean = false;

  userProfileEditPassword: boolean = false;

  profileDataById: ProfileEditInterface | null = null;

  vPWD1: boolean = false;
  vPWD2: boolean = false;
  vPWD3: boolean = false;
  vPWD4: boolean = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private alert: AlertNormal,
    private registerService: RegisterServiceService,
    private profileCom: ProfileListComponent,
    private translate: TranslateService,
    public auth: AuthService,
    private altConfirm: AlertConfirm,
    private router: Router
  ) {}

  checkEmailExists(email: string) {
    return this.registerService.checkEmailExists(email).pipe(
      switchMap((response) => {
        return [response.exists];
      })
    );
  }

  adminCheckEmail: boolean = true;
  adminInputEmail: string = "";
  onInputCheckEmail() {
    const emailChecker = {
      id: this.editForm.value.id,
      email: this.adminInputEmail,
    };
    this.profileService.adminCheckEmail(emailChecker).subscribe(
      (res) => {
        this.adminCheckEmail = res;
      },
      (err) => {
        console.error("API get email status error: ", err);
        this.adminCheckEmail = false;
      }
    );
  }

  editForm: FormGroup = this.fb.group({
    id: new FormControl(null),
    profileCode: new FormControl(null),
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    image: new FormControl(null),
    // email: new FormControl(null, [Validators.required, Validators.email]),
    email: new FormControl(null, [Validators.required]),
    telephone: new FormControl(null, [this.conditionalTelephoneValidator()]),
    role: new FormControl(null),
  });

  passwordForm: FormGroup = this.fb.group(
    {
      id: new FormControl(null),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmPwd: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    },
    { validators: this.passwordMatchValidator }
  );

  registerForm: FormGroup = this.fb.group(
    {
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      image: new FormControl(null),
      // email: new FormControl(null, [Validators.required, Validators.email]),
      email: new FormControl(null, [Validators.required]),
      telephone: new FormControl(null, [this.conditionalTelephoneValidator()]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmPwd: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      role: new FormControl("R002"),
    },
    { validators: this.passwordMatchValidator }
  );

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

  passwordMatchValidator(formGroup: FormGroup): null | { mismatch: boolean } {
    const password = formGroup.get("password")?.value;
    const confirmPwd = formGroup.get("confirmPwd")?.value;
    return password === confirmPwd ? null : { mismatch: true };
  }

  get statusImagePick() {
    return this.userProfileManage
      ? true
      : !this.userProfileManage
      ? !this.userProfileEditPassword
        ? true
        : false
      : false;
  }

  onFormSubmit(ruleType: "EDIT" | "ADD" | "PWD") {
    if (ruleType === "ADD") {
      this.registerForm.markAllAsTouched();
      if (this.registerForm.valid) {
        this.profileCom.loadingTable = true;
        this.checkEmailExists(this.registerForm.value.email).subscribe((res) => {
          if (res) {
            this.registerForm.patchValue({ email: "" });
            this.alert.show(
              this.translate.instant("emailInUse"),
              this.translate.instant("tryAgainLater"),
              "error"
            );
          } else {
            this.profileService.adminAddUserProfile(this.registerForm.value).subscribe(
              (res) => {
                (
                  document.getElementById("closeModalButtonProfile") as HTMLElement
                ).click();
                this.alert.show(
                  this.translate.instant("registrationSuccess"),
                  "",
                  "success"
                );
                this.profileCom.loadBookTablesOnManage();
              },
              (err) => {
                console.log(err);
              }
            );
          }
        });

        //
      }
    } else if (ruleType === "EDIT") {
      if (this.editForm.valid) {
        if (this.adminCheckEmail) {
          const token = this.auth.getToken();
          if (token) {
            let decodedToken: any = this.auth.decodeTokenJWT(token);

            if (
              decodedToken &&
              this.editForm.value.profileCode === decodedToken.profileCode &&
              this.editForm.value?.role !== decodedToken.roles[0]
            ) {
              this.altConfirm
                .confirm(
                  this.translate.instant("confirmEditLocation"),
                  this.translate.instant("reloginRequired"),
                  "EDIT"
                )
                .then((result) => {
                  if (result) {
                    this.profileCom.loadingTable = true;
                    this.profileService.adminEditProfile(this.editForm.value).subscribe(
                      (res) => {
                        this.profileCom.loadingTable = false;
                        (
                          document.getElementById(
                            "closeModalButtonProfile"
                          ) as HTMLElement
                        ).click();

                        this.auth.onEditRole(
                          this.editForm.value?.profileCode,
                          this.editForm.value?.role
                        );
                        let statusRes: boolean = true;
                        if (!this.auth.getToken()) {
                          statusRes = false;
                          this.altConfirm
                            .confirm(
                              this.translate.instant("updateSuccess"),
                              this.translate.instant("pleaseLoginAgain"),
                              "FINISHED"
                            )
                            .then((result) => {
                              if (result === true || result === undefined) {
                                this.router.navigateByUrl("/login");
                              }
                              return null;
                            });
                        }

                        this.alert.show(
                          this.translate.instant("updateSuccess"),
                          "",
                          "success"
                        );

                        if (statusRes) {
                          this.profileCom.loadBookTablesOnManage();
                        }
                      },
                      (err) => {
                        this.profileCom.loadingTable = false;
                        console.log(err);
                      }
                    );
                  }
                });
            } else {
              this.profileCom.loadingTable = true;
              this.profileService.adminEditProfile(this.editForm.value).subscribe(
                (res) => {
                  this.profileCom.loadingTable = false;
                  (
                    document.getElementById("closeModalButtonProfile") as HTMLElement
                  ).click();

                  this.auth.onEditRole(
                    this.editForm.value?.profileCode,
                    this.editForm.value?.role
                  );
                  let statusRes: boolean = true;
                  if (!this.auth.getToken()) {
                    statusRes = false;
                    this.altConfirm
                      .confirm(
                        this.translate.instant("updateSuccess"),
                        this.translate.instant("pleaseLoginAgain"),
                        "FINISHED"
                      )
                      .then((result) => {
                        if (result === true || result === undefined) {
                          this.router.navigateByUrl("/login");
                        }
                        return null;
                      });
                  }

                  this.alert.show(this.translate.instant("updateSuccess"), "", "success");

                  if (statusRes) {
                    this.profileCom.loadBookTablesOnManage();
                  }
                },
                (err) => {
                  this.profileCom.loadingTable = false;
                  console.log(err);
                }
              );
            }
          } else {
            console.log("Error None token");
          }
        } else {
          this.alert.show(this.translate.instant("emailUnavailable"), "", "error");
        }
      } else {
        this.editForm.markAllAsTouched();
      }
    } else if (ruleType === "PWD") {
      if (this.passwordForm.valid) {
        const objReset: ProfileByIdResetPasswordInterface = {
          id: this.passwordForm.value.id,
          password: this.passwordForm.value.password,
        };
        this.profileService.adminEditProfilePassword(objReset).subscribe(
          (res) => {
            this.alert.show(
              this.translate.instant("passwordUpdateSuccess"),
              "",
              "success"
            );
            this.passwordForm.patchValue({
              password: "",
              confirmPwd: "",
            });
            this.userProfileEditPassword = false;
            this.profileCom.loadingTable = false;
          },
          (err) => {
            console.error("header get Error:", err);
            this.profileCom.loadingTable = false;
          }
        );
      } else {
        this.passwordForm.markAllAsTouched();
      }
    } else {
      console.error("Invalid ruleType");
    }
  }

  validForm1(key: string): boolean {
    const control = this.registerForm.get(key);
    return !!(control && control.touched && control.invalid);
  }

  validForm2(key: string): boolean {
    const control = this.editForm.get(key);
    return !!(control && control.touched && control.invalid);
  }

  validForm3(key: string): boolean {
    const control = this.passwordForm.get(key);
    return !!(control && control.touched && control.invalid);
  }

  loadProfileModal(): void {
    if (this.userUserId) {
      this.profileService.getProfileByIdEntity(this.userUserId).subscribe(
        (response) => {
          this.profileDataById = response;
          this.userProfileEditPassword = false;
          this.editForm.patchValue({
            ...response,
            role: response.role,
          });

          this.passwordForm.patchValue({
            id: response.id,
          });

          const emailChecker = {
            id: response.id,
            email: response.email,
          };
          this.profileService.adminCheckEmail(emailChecker).subscribe(
            (res) => {
              this.adminCheckEmail = res;
            },
            (err) => {
              console.error("API get email status error: ", err);
              this.adminCheckEmail = false;
            }
          );

          const modalElement = document.getElementById("modalProfileManage");
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
          this.profileCom.loadingTable = false;
        },
        (error) => {
          console.error("header get Error:", error);
          this.profileCom.loadingTable = false;
        }
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["userUserId"] && !changes["userUserId"].isFirstChange()) {
      if (this.userUserId !== 0) {
        this.loadProfileModal();
      }
    }
  }

  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      this.imageChangedEvent = event;

      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const img = new Image();
        img.src = base64;

        img.onload = () => {
          console.log(`Width: ${img.width}px, Height: ${img.height}px`);

          if (img.width !== img.height || img.width > 300 || img.height > 300) {
            new bootstrap.Modal(document.getElementById("cropModalProfile")).show();
            input.value = "";
            return;
          }

          if (this.userProfileManage) {
            this.registerForm.patchValue({
              image: base64,
            });
          } else if (!this.userProfileManage && !this.userProfileEditPassword) {
            this.editForm.patchValue({
              image: base64,
            });
          } else {
            console.log("No image selected for password reset");
          }

          input.value = "";
        };
      };
      reader.readAsDataURL(file);
    }
  }

  // ---------------------------------

  imageChangedEvent: any = "";
  cropBase64: string | null | undefined = "";

  onCropProfile(event: ImageCroppedEvent) {
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

  onSetCropProfile() {
    if (this.userProfileManage) {
      this.registerForm.patchValue({
        image: this.cropBase64,
      });
    } else if (!this.userProfileManage && !this.userProfileEditPassword) {
      this.editForm.patchValue({
        image: this.cropBase64,
      });
    } else {
      console.log("No image selected for password reset");
    }

    (document.getElementById("closeModalCropProfile") as HTMLElement).click();

    this.cropBase64 = "";
    this.imageChangedEvent = "";
  }

  // ---------------------------------

  get getImageIcon(): string {
    const imageRegister = this.registerForm.value.image
      ? this.registerForm.value.image
      : "./takeLibro/icon_user.png";
    const imageEdit = this.editForm.value.image
      ? this.editForm.value.image
      : "./takeLibro/icon_user.png";
    return this.userProfileManage ? imageRegister : imageEdit;
  }

  statusPWD1() {
    this.vPWD1 = !this.vPWD1;
  }
  statusPWD2() {
    this.vPWD2 = !this.vPWD2;
  }

  statusPWD3() {
    this.vPWD3 = !this.vPWD3;
  }

  statusPWD4() {
    this.vPWD4 = !this.vPWD4;
  }

  formAddisReset() {
    this.registerForm.reset();
    this.registerForm.patchValue({
      role: "R002",
    });
  }

  isPasswordMismatch(): boolean {
    return (
      this.registerForm.errors?.["mismatch"] &&
      (this.registerForm.get("password")?.touched ||
        this.registerForm.get("confirmPwd")?.touched)
    );
  }

  isPasswordMismatchOnReset(): boolean {
    return (
      this.passwordForm.errors?.["mismatch"] &&
      (this.passwordForm.get("password")?.touched ||
        this.passwordForm.get("confirmPwd")?.touched)
    );
  }
}
