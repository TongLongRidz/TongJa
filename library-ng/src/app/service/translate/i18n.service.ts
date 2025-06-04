import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private langSubject = new BehaviorSubject<string>('th');
  currentLang = this.langSubject.asObservable();

  private AvailableEvent = new BehaviorSubject<boolean>(false);
  public EventI18n$ = this.AvailableEvent.asObservable();

  changeLanguage(lang: string) {
    this.langSubject.next(lang);
    localStorage.setItem('Language', lang);
    this.AvailableEvent.next(true);
  }

  getLanguageLocal() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('Language');
    }
    return null;
  }
}

export function i18nOnInit(translate: TranslateService, i18n: I18nService) {
  const storedLang = i18n.getLanguageLocal();
  if (storedLang) {
    translate.use(storedLang);
    i18n.changeLanguage(storedLang);
  }

  i18n.currentLang.subscribe((lang) => {
    translate.use(lang);
  });
}
