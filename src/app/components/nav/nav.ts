import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  viewChild,
  viewChildren,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import gsap from 'gsap';
import { filter } from 'rxjs';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './nav.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Nav implements AfterViewInit {
  protected readonly links = [
    { label: 'nav.home', route: '/home', exact: true },
    { label: 'nav.work', route: '/work', exact: false },
    { label: 'nav.about', route: '/about', exact: false },
    { label: 'nav.contact', route: '/contact', exact: false },
  ];

  private readonly pillRef = viewChild.required<ElementRef<HTMLElement>>('pill');
  private readonly navLinks = viewChildren<ElementRef<HTMLElement>>('navLink');
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  ngAfterViewInit(): void {
    requestAnimationFrame(() => this.movePill(false));

    const nav = this.pillRef().nativeElement.parentElement!;
    const ro = new ResizeObserver(() => this.movePill(false));
    ro.observe(nav);
    this.destroyRef.onDestroy(() => ro.disconnect());

    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => setTimeout(() => this.movePill(true)));
  }

  private movePill(animate: boolean): void {
    const pill = this.pillRef().nativeElement;
    const nav = pill.parentElement!;
    const activeLink = this.navLinks().find(r => r.nativeElement.classList.contains('active'));

    if (!activeLink) {
      gsap.set(pill, { autoAlpha: 0 });
      return;
    }

    const el = activeLink.nativeElement;
    const navRect = nav.getBoundingClientRect();
    const linkRect = el.getBoundingClientRect();
    const navStyle = getComputedStyle(nav);
    const borderLeft = Number.parseFloat(navStyle.borderLeftWidth);
    const borderTop = Number.parseFloat(navStyle.borderTopWidth);

    const pillProps = {
      autoAlpha: 1,
      x: linkRect.left - navRect.left - borderLeft,
      y: linkRect.top - navRect.top - borderTop,
      width: linkRect.width,
      height: linkRect.height,
    };

    if (animate) {
      gsap.to(pill, { ...pillProps, duration: 0.3, ease: 'power3.inOut' });
    } else {
      gsap.set(pill, pillProps);
    }
  }
}
