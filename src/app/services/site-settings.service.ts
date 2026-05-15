import { Injectable, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { LanguageService } from './language.service';

interface SiteSettingsTranslation {
  location: string;
  availability_label: string;
  availability_from: string;
  availability_description: string;
}

interface SiteSettingsData {
  email: string;
  availability_open: boolean;
  en: SiteSettingsTranslation;
  fr: SiteSettingsTranslation;
  nl: SiteSettingsTranslation;
  es: SiteSettingsTranslation;
}

export interface SiteSettings extends SiteSettingsTranslation {
  email: string;
  availability_open: boolean;
}

@Injectable({ providedIn: 'root' })
export class SiteSettingsService {
  private readonly http = inject(HttpClient);
  private readonly languageService = inject(LanguageService);

  private readonly allSettings = toSignal(
    this.http.get<SiteSettingsData>('/data/site-settings.json'),
    { initialValue: null }
  );

  readonly settings = computed<SiteSettings | null>(() => {
    const all = this.allSettings();
    const lang = this.languageService.currentLang();
    if (!all) return null;
    return {
      email: all.email,
      availability_open: all.availability_open,
      ...all[lang],
    };
  });
}