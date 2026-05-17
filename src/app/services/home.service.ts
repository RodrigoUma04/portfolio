import { Injectable, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { LanguageService } from './language.service';

export interface TechItem {
  name: string;
  devicon_class: string;
}

export interface HomeTranslation {
  tagline: string;
  description: string;
}

interface HomeData {
  outer_ring: TechItem[];
  middle_ring: TechItem[];
  inner_ring: TechItem[];
  en: HomeTranslation;
  fr: HomeTranslation;
  nl: HomeTranslation;
  es: HomeTranslation;
}

@Injectable({ providedIn: 'root' })
export class HomeService {
  private readonly http = inject(HttpClient);
  private readonly languageService = inject(LanguageService);

  private readonly allData = toSignal(
    this.http.get<HomeData>('/data/home.json'),
    { initialValue: null }
  );

  readonly content = computed<HomeTranslation | null>(() => {
    const all = this.allData();
    const lang = this.languageService.currentLang();
    if (!all) return null;
    return all[lang] ?? all['en'];
  });

  readonly outerRing = computed<TechItem[]>(() => this.allData()?.outer_ring ?? []);
  readonly middleRing = computed<TechItem[]>(() => this.allData()?.middle_ring ?? []);
  readonly innerRing = computed<TechItem[]>(() => this.allData()?.inner_ring ?? []);
}