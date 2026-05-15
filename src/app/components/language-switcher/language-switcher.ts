import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { LanguageService, type Lang } from '../../services/language.service';

@Component({
  selector: 'app-language-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './language-switcher.html',
  host: {
    '(document:click)': 'close()',
  },
})
export class LanguageSwitcher {
  protected readonly languageService = inject(LanguageService);
  protected readonly open = signal(false);

  protected toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.open.update(v => !v);
  }

  protected select(lang: Lang, event: MouseEvent): void {
    event.stopPropagation();
    this.languageService.setLanguage(lang);
    this.open.set(false);
  }

  protected close(): void {
    this.open.set(false);
  }
}