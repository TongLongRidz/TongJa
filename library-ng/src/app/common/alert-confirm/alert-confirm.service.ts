import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AlertConfirm {

  private translate = inject(TranslateService);
  
  constructor() {}

  confirm(
    title: string,
    text: string,
    ruleType: 'EDIT' | 'REMOVE' | 'FINISHED' | 'OK'
  ): Promise<any> {
    if (typeof window !== 'undefined') {
      return import('sweetalert2').then((Swal) => {
        return this.translate.get(['confirm', 'cancel', 'ok', 'remove']).toPromise().then(translations => {
          
          const confirmButtonText = ruleType === 'REMOVE' ? translations['remove'] || 'Remove' : translations['ok'] || 'OK';
          const cancelButtonText = translations['cancel'] || 'Cancel';
          
          const options: any = {
            title: title,
            html: `<div class="alert-text mb-2">${text}</div>`,
            icon: this.getIcon(ruleType),
            showCancelButton: this.showCancelButton(ruleType),
            confirmButtonColor: this.getConfirmButtonColor(ruleType),
            cancelButtonColor: '#C8D0D1',
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
            customClass: {
              title: 'alert-title',
            }
          };

          return Swal.default.fire(options).then((result) => result.isConfirmed);
        });
      });
    } else {
      return Promise.resolve(false);
    }
  }

  private getIcon(ruleType: 'EDIT' | 'REMOVE' | 'FINISHED' | 'OK'): 'warning' | 'success' {
    return ruleType === 'FINISHED' ? 'success' : 'warning';
  }

  private getConfirmButtonColor(ruleType: 'EDIT' | 'REMOVE' | 'FINISHED' | 'OK'): string {
    switch (ruleType) {
      case 'REMOVE':
        return '#EC7063';
      case 'EDIT':
        return '#6A9C89';
      case 'FINISHED':
        return '#6A9C89';
      default:
        return '#5dade2';
    }
  }

  private showCancelButton(ruleType: 'EDIT' | 'REMOVE' | 'FINISHED' | 'OK'): boolean {
    return ruleType === 'FINISHED' ? false : true;
  }
}
