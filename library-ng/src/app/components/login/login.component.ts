import { Component, inject } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from "@angular/forms";
import { LoginServiceService } from "../../service/login/login-service.service";
import { RegisterServiceService } from "../../service/register/register-service.service";
import { Router } from "@angular/router";
import { AlertNormal } from "../../common/alert-normal/alert-normal.service";
import { switchMap } from "rxjs";
import { AuthService } from "../../service/auth/auth.service";
import { TranslateService } from "@ngx-translate/core";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { Environment } from "../../common/environment";

declare var bootstrap: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  vPWD1: boolean = false;
  vPWD2: boolean = false;
  vPWD3: boolean = false;

  route = inject(Router);
  alert = inject(AlertNormal);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private translate: TranslateService,
    private loginService: LoginServiceService,
    private registerService: RegisterServiceService
  ) {
    console.log("profile : ", Environment.envProfile);
  }

  loginForm: FormGroup = this.fb.group({
    email: [null],
    password: [null, [Validators.required, Validators.minLength(6)]],
  });

  // prettier-ignore
  registerForm: FormGroup = this.fb.group({
      image: new FormControl(null),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      telephone: new FormControl(null, [this.conditionalTelephoneValidator()]),
      password: new FormControl(null, [ Validators.required, Validators.minLength(6)]),
      confirmPwd: new FormControl(null, [ Validators.required, Validators.minLength(6)]),
    }, { validators: this.passwordMatchValidator }
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

  isPasswordMismatch(): boolean {
    return (
      this.registerForm.errors?.["mismatch"] &&
      (this.registerForm.get("password")?.touched ||
        this.registerForm.get("confirmPwd")?.touched)
    );
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
          // console.log(`Width: ${img.width}px, Height: ${img.height}px`);

          if (img.width !== img.height || img.width > 300 || img.height > 300) {
            new bootstrap.Modal(document.getElementById("cropModalRegister")).show();
            input.value = "";
            return;
          }

          this.registerForm.patchValue({
            image: base64,
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

  onCropRegister(event: ImageCroppedEvent) {
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

  onSetCropRegister() {
    this.registerForm.patchValue({
      image: this.cropBase64,
    });

    (document.getElementById("closeModalCropRegister") as HTMLElement).click();

    this.cropBase64 = "";
    this.imageChangedEvent = "";
  }

  // ---------------------------------

  validForm1(key: string): boolean {
    const control = this.loginForm.get(key);
    return !!(control && control.touched && control.invalid);
  }

  validForm2(key: string): boolean {
    const control = this.registerForm.get(key);
    return !!(control && control.touched && control.invalid);
  }

  onSubmitLogin(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.loginService
        .onLogin(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe(
          (response) => {
            // this.alert.show('เข้าสู่ระบบสำเร็จ', '', 'success');
            if (response && response.accessToken) {
              this.auth.saveToken(response.accessToken);
              this.route.navigateByUrl("/take-libro");
              this.auth.setStatusLogin(true);
            }
          },
          (error) => {
            console.log(error);
            this.alert.show(
              this.translate.instant("errorOccurred") +
                " " +
                (error.status === 0 ? 404 : error.status),
              this.translate.instant("tryAgainLater"),
              "error"
            );
          }
        );
    }
  }

  onSubmitRegister(): void {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      const register = { ...this.registerForm.value };
      this.checkEmailExists(register.email).subscribe((res) => {
        if (res) {
          this.registerForm.patchValue({ email: "" });
          this.alert.show(
            this.translate.instant("emailInUse"),
            this.translate.instant("tryAgainLater"),
            "error"
          );
        } else {
          this.registerService.registerUser(register).subscribe(
            (response) => {
              this.registerForm.reset();
              this.alert
                .show(this.translate.instant("registrationSuccess"), "", "success")
                .then((result) => {
                  setTimeout(() => {
                    this.toggleAnimation();
                    this.loginForm.patchValue({
                      email: register.email,
                      password: register.password,
                    });
                    setTimeout(() => {
                      this.onSubmitLogin();
                    }, 1000);
                  }, 300);
                });
            },
            (error) => {
              this.alert.show(
                this.translate.instant("errorOccurred") +
                  " " +
                  (error.status === 0 ? 404 : error.status),
                this.translate.instant("tryAgainLater"),
                "error"
              );
            }
          );
        }
      });
    }
  }

  checkEmailExists(email: string) {
    return this.registerService.checkEmailExists(email).pipe(
      switchMap((response) => {
        return [response.exists];
      })
    );
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

  animateCircle: boolean = false;
  toggleAnimation(): void {
    this.registerForm.reset();
    this.loginForm.reset();
    this.vPWD1 = false;
    this.vPWD2 = false;
    this.vPWD3 = false;
    this.animateCircle = !this.animateCircle;
  }

  openDocManual(): void {
    this.loginService.getDocManual().subscribe(
      (res) => {
        const blob = new Blob([res], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
      },
      (err) => {
        console.log("get doc manual error =>", err);
      }
    );
  }
}
