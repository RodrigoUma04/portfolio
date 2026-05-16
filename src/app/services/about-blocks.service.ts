import { Injectable, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { LanguageService } from './language.service';

export type BlockType = 'headline' | 'bio' | 'facts' | 'cards' | 'timeline' | 'currents' | 'quote' | 'cta';

export interface AboutBlock { type: BlockType; data: unknown; }

export interface HeadlineData { title: string; subtitle?: string; }
export interface BioData { content: string; }
export interface FactItem { label?: string; value: string; }
export interface FactsData { items: FactItem[]; }
export interface CardItem { title: string; body: string; tag?: string; }
export interface CardsData { cols?: number; items: CardItem[]; }
export interface TimelineItem { date: string; title: string; subtitle?: string; body?: string; tag?: string; }
export interface TimelineData { items: TimelineItem[]; }
export interface CurrentsColumn { label?: string; items: string[]; }
export interface CurrentsData { columns: CurrentsColumn[]; }
export interface QuoteData { text: string; attribution?: string; }
export interface CtaData { text: string; }

@Injectable({ providedIn: 'root' })
export class AboutBlocksService {
  private readonly http = inject(HttpClient);
  private readonly languageService = inject(LanguageService);

  private readonly allBlocks = toSignal(
    this.http.get<Record<string, AboutBlock[]>>('/data/about-blocks.json'),
    { initialValue: null }
  );

  readonly blocks = computed<AboutBlock[]>(() => {
    const all = this.allBlocks();
    const lang = this.languageService.currentLang();
    if (!all) return [];
    return all[lang] ?? all['en'] ?? [];
  });
}