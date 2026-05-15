import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  input,
  output,
  viewChild,
  viewChildren,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import gsap from 'gsap';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { SiteSettingsService } from '../../services/site-settings.service';

@Component({
  selector: 'app-mobile-nav',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, LanguageSwitcher],
  templateUrl: './mobile-nav.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(touchstart)': 'onTouchStart($event)',
    '(touchend)': 'onTouchEnd($event)',
    '(document:keydown.escape)': 'onEsc()',
  },
})
export class MobileNav implements AfterViewInit {
  isOpen = input<boolean>(false);
  closed = output<void>();

  protected readonly siteSettings = inject(SiteSettingsService).settings;

  protected readonly links = [
    { label: 'nav.home', route: '/home', exact: true },
    { label: 'nav.work', route: '/work', exact: false },
    { label: 'nav.about', route: '/about', exact: false },
    { label: 'nav.contact', route: '/contact', exact: false },
  ];

  private readonly overlayRef = viewChild.required<ElementRef<HTMLElement>>('overlay');
  private readonly navLinks = viewChildren<ElementRef<HTMLElement>>('navLink');

  private touchStartX = 0;
  private initialized = false;

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (!this.initialized) return;
      open ? this.animateOpen() : this.animateClose();
    });
  }

  ngAfterViewInit(): void {
    gsap.set(this.overlayRef().nativeElement, { autoAlpha: 0, x: '100%' });
    this.initialized = true;
  }

  protected onLinkClick(): void {
    this.closed.emit();
  }

  protected onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  protected onTouchEnd(event: TouchEvent): void {
    const delta = event.changedTouches[0].clientX - this.touchStartX;
    if (delta > 60) {
      this.closed.emit();
    }
  }

  protected onEsc(): void {
    if (this.isOpen()) {
      this.closed.emit();
    }
  }

  private animateOpen(): void {
    const linkEls = this.navLinks().map(r => r.nativeElement);
    gsap.to(this.overlayRef().nativeElement, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out' });
    gsap.fromTo(
      linkEls,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.08, delay: 0.15, ease: 'power2.out' }
    );
  }

  private animateClose(): void {
    const linkEls = this.navLinks().map(r => r.nativeElement);
    gsap.to(linkEls, { opacity: 0, duration: 0.15, ease: 'power2.in' });
    gsap.to(this.overlayRef().nativeElement, { autoAlpha: 0, x: '100%', duration: 0.35, delay: 0.1, ease: 'power3.in' });
  }
}
