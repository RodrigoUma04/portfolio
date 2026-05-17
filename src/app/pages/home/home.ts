import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import gsap from 'gsap';
import { AccentPipe } from '../../pipes/accent.pipe';
import { HomeService } from '../../services/home.service';
import { SiteSettingsService } from '../../services/site-settings.service';
import { TechOrb } from './tech-orb/tech-orb';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TranslatePipe, AccentPipe, TechOrb],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col flex-1' },
})
export class Home implements AfterViewInit {
  private readonly elRef = inject(ElementRef);
  protected readonly homeService = inject(HomeService);
  protected readonly siteSettings = inject(SiteSettingsService).settings;

  ngAfterViewInit() {
    const el = this.elRef.nativeElement as HTMLElement;
    const targets = el.querySelectorAll('.hero-animate');

    if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(targets, { opacity: 0, y: 20 });
    gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
    });
  }
}
