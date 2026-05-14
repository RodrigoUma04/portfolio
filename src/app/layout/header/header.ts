import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Nav } from '../../components/nav/nav';
import { MobileNav } from '../../components/mobile-nav/mobile-nav';

@Component({
  selector: 'app-header',
  imports: [Nav, MobileNav],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected isMenuOpen = signal(false);

  constructor() {
    inject(Router).events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe(() => this.isMenuOpen.set(false));
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}