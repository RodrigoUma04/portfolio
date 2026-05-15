import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Lang = 'en' | 'fr' | 'nl' | 'es';

const LANGS: Lang[] = ['en', 'fr', 'nl', 'es'];
const STORAGE_KEY = 'lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);

  readonly langs = LANGS;
  readonly currentLang = signal<Lang>((localStorage.getItem(STORAGE_KEY) as Lang | null) ?? 'en');

  constructor() {
    this.translate.addLangs(LANGS);
    this.translate.setFallbackLang('en');
    this.translate.use(this.currentLang());
  }

  setLanguage(lang: Lang): void {
    this.currentLang.set(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    this.translate.use(lang);
  }
}
