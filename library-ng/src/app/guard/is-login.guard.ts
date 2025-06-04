import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../service/auth/auth.service";
import { AlertConfirm } from "../common/alert-confirm/alert-confirm.service";

export const isLoginGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const altConfirm = inject(AlertConfirm);
  if (!auth.getToken()) {
    // altConfirm
    //   .confirm(
    //     'กรุณาลงชื่อเข้าใช้งานระบบ',
    //     'ไม่พบข้อมูลผู้ใช้ในระบบ โปรดทำการลงชื่อเข้าใช้งาน',
    //     'OK'
    //   )
    //   .then((result) => {
    //     if (result === true || result === undefined) {
    //       router.navigateByUrl('/login');
    //     }
    //   });
    auth.clearToken();
    router.navigateByUrl("/login");
    return false;
  }
  return true;
};
