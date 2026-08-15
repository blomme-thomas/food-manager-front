import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzI18nService, fr_FR, en_US } from 'ng-zorro-antd/i18n';
import { BehaviorSubject } from 'rxjs';

export type SupportedLanguage = 'fr' | 'en';

const DEFAULT_LANGUAGE: SupportedLanguage = 'fr';
const LANGUAGE_STORAGE_KEY = 'food-manager-language';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translateService = inject(TranslateService);
  private readonly nzI18nService = inject(NzI18nService);
  private readonly document = inject(DOCUMENT);

  private languageSubject = new BehaviorSubject<SupportedLanguage>(DEFAULT_LANGUAGE);
  public language$ = this.languageSubject.asObservable();

  readonly supportedLanguages: readonly SupportedLanguage[] = ['fr', 'en'];

  initialize(): void {
    this.translateService.addLangs([...this.supportedLanguages]);

    const storedLanguage = this.getStoredLanguage();
    const browserLanguage = this.getBrowserLanguage();

    this.setLanguage(storedLanguage ?? browserLanguage ?? DEFAULT_LANGUAGE);
  }

  setLanguage(language: SupportedLanguage): void {
    if (!this.isSupportedLanguage(language)) {
      return;
    }

    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    this.document.documentElement.lang = language;

    this.translateService.use(language);
    this.nzI18nService.setLocale(language === 'fr' ? fr_FR : en_US);
    this.languageSubject.next(language);
  }

  getCurrentLanguage(): SupportedLanguage {
    const currentLanguage = this.translateService.getCurrentLang();

    return this.isSupportedLanguage(currentLanguage) ? currentLanguage : DEFAULT_LANGUAGE;
  }

  private getStoredLanguage(): SupportedLanguage | null {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

    return this.isSupportedLanguage(storedLanguage) ? storedLanguage : null;
  }

  private getBrowserLanguage(): SupportedLanguage | null {
    const browserLanguage = navigator.language.split('-')[0]?.toLowerCase();

    return this.isSupportedLanguage(browserLanguage) ? browserLanguage : null;
  }

  private isSupportedLanguage(language: string | null | undefined): language is SupportedLanguage {
    return language === 'fr' || language === 'en';
  }
}
