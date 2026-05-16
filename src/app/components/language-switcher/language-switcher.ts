import { ChangeDetectionStrategy, Component, Injector, afterNextRender, effect, inject, input, signal, viewChild, ElementRef } from '@angular/core';
import { gsap } from 'gsap';
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
  readonly openUp = input(false);
  protected readonly languageService = inject(LanguageService);
  protected readonly open = signal(false);

  private readonly injector = inject(Injector);
  private readonly dropdownRef = viewChild<ElementRef<HTMLElement>>('dropdown');

  constructor() {
    afterNextRender(() => {
      const el = this.dropdownRef()?.nativeElement;
      if (!el) return;
      const yOffset = this.openUp() ? 6 : -6;
      gsap.set(el, { opacity: 0, y: yOffset, pointerEvents: 'none' });

      effect(() => {
        const isOpen = this.open();
        gsap.to(el, {
          opacity: isOpen ? 1 : 0,
          y: isOpen ? 0 : yOffset,
          duration: 0.15,
          ease: 'power2.out',
          overwrite: true,
          onStart: () => { if (isOpen) gsap.set(el, { pointerEvents: 'auto' }); },
          onComplete: () => { if (!isOpen) gsap.set(el, { pointerEvents: 'none' }); },
        });
      }, { injector: this.injector });
    });
  }

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