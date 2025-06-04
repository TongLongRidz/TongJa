import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../service/auth/auth.service";
import { AlertConfirm } from "../common/alert-confirm/alert-confirm.service";

export const tokenAlreadyGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const altConfirm = inject(AlertConfirm);
  const router = inject(Router);
  const token = auth.getToken();

  if (token) {
    const decode = auth.decodeTokenJWT(token);
    if (decode && decode.exp) {
      const expirationDate = new Date(decode.exp * 1000);
      if (expirationDate <= new Date()) {
        // altConfirm
        //   .confirm("โทเคนหมดอายุ !!!", "โปรดทำการลงชื่อเข้าใช้งาน", "OK")
        //   .then((result) => {
        //     if (result === true || result === undefined) {
        //       auth.clearToken();
        //       router.navigateByUrl("/login");
        //       // window.location.reload();
        //     }
        //   });

        auth.clearToken();
        router.navigateByUrl("/login");
        return false;
      }
    }
  }

  return true;
};
