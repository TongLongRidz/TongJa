import { CanActivateFn, Router } from '@angular/router';
import { BookService } from '../service/book/book-service.service';
import { inject } from '@angular/core';
import { AlertNormal } from '../common/alert-normal/alert-normal.service';

export const bookDetailGuard: CanActivateFn = async (route) => {
  const bookService = inject(BookService);
  const router = inject(Router);
  const alert = inject(AlertNormal);

  const id = +route.paramMap.get('id')!;

  try {
    const res = await bookService.checkBookDetailByID(id);
    if (res) {
      return true;
    } else {
      await alert.show(
        'ไม่พบข้อมูลไอดี !!',
        'โปรดทำการเลือกหนังสือจากหน้าหลักอีกครั้ง...',
        'warning'
      );
      await router.navigate(['/']);
      window.location.reload();
      return false;
    }
  } catch (err) {
    await alert.show(
      'เกิดข้อผิดพลาด ' + err,
      'โปรดลองอีกครั้งในภายหลัง',
      'error'
    );
    await router.navigate(['/']);
    window.location.reload();
    return false;
  }
};
