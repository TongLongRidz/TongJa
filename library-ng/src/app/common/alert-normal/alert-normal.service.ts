import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertNormal {
  constructor() {}

  show(title: string, text: string, icon: SweetAlertIcon): Promise<any> {
    return Swal.fire({
      position: 'center',
      title: title,
      html: `<div class="alert-text mb-4">${text}</div>`,
      icon: icon,
      timer: 1500,
      showConfirmButton: false,
      customClass: {
        title: 'alert-title',
      },
    });
  }
}
