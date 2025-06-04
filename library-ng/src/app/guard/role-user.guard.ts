import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';
import { AlertConfirm } from '../common/alert-confirm/alert-confirm.service';

export const roleUserGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const platformId = inject(PLATFORM_ID); // Inject the platform
  const altConfirm = inject(AlertConfirm);
  const router = inject(Router);

  let userRoles: string[] = [];
  let token: string | null = null;

  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('accessToken');
  }

  if (token) {
    const decodedToken: any = auth.decodeTokenJWT(token);
    userRoles = decodedToken.roles || [];
  }

  const requiredRoles = ['R001', 'R003'];
  const hasAccess = userRoles.some((role) => requiredRoles.includes(role));

  if (hasAccess) {
    return true;
  } else {
    altConfirm
      .confirm(
        'คุณไม่มีสิทธิการเข้าถึง',
        'คุณไม่มีสิทธิในการเข้าถึงหน้านี้ กรุณาติดต่อผู้ดูแลระบบหากต้องการการเข้าถึง',
        'OK'
      )
      .then((result) => {
        if (result === true || result === undefined) {
          router.navigateByUrl('/home');
        }
      });

    return false;
  }
};
