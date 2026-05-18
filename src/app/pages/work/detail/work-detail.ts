import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import gsap from 'gsap';
import { ProjectSection, ProjectsService, ProjectViewModel } from '../../../services/projects.service';
import { ScrollRevealDirective } from '../../../directives/scroll-reveal.directive';

export type MediaSlide = { type: 'image'; url: string } | { type: 'video'; url: string };

@Component({
  selector: 'app-work-detail',
  imports: [RouterLink, ScrollRevealDirective, TranslatePipe],
  templateUrl: './work-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col flex-1 select-none' },
})
export class WorkDetail implements AfterViewInit {
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private marqueeAnimation: gsap.core.Tween | null = null;

  @ViewChild('marqueeTrack') set marqueeTrackRef(el: ElementRef<HTMLElement> | undefined) {
    this.marqueeAnimation?.kill();
    this.marqueeAnimation = null;
    if (!el) return;
    setTimeout(() => this.setupMarquee(el.nativeElement), 0);
  }

  private readonly projectsService = inject(ProjectsService);

  private readonly slug = toSignal(
    inject(ActivatedRoute).paramMap.pipe(map(p => p.get('slug') ?? '')),
    { initialValue: '' }
  );

  protected readonly project = this.projectsService.projectBySlug(this.slug);

  protected readonly nextProject = computed<ProjectViewModel | null>(() => {
    const all = this.projectsService.projects();
    if (!all.length) return null;
    const idx = all.findIndex(p => p.slug === this.slug());
    return all[(idx + 1) % all.length];
  });

  protected readonly doubledStack = computed(() => {
    const p = this.project();
    if (!p) return [];
    return [...p.stack, ...p.stack];
  });

  protected readonly mediaIndices = signal<Record<number, number>>({});

  ngAfterViewInit() {
    const targets = this.elRef.nativeElement.querySelectorAll('.hero-animate');
    if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }
    gsap.set(targets, { opacity: 0, y: 20 });
    gsap.to(targets, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' });
  }

  protected mediaIndex(sectionIdx: number): number {
    return this.mediaIndices()[sectionIdx] ?? 0;
  }

  protected slides(section: ProjectSection): MediaSlide[] {
    const images = section.media.map(url => ({ type: 'image' as const, url }));
    const video = section.video ? [{ type: 'video' as const, url: section.video }] : [];
    return [...images, ...video];
  }

  protected prevSlide(sectionIdx: number, total: number): void {
    this.mediaIndices.update(r => ({
      ...r,
      [sectionIdx]: ((r[sectionIdx] ?? 0) - 1 + total) % total,
    }));
  }

  protected nextSlide(sectionIdx: number, total: number): void {
    this.mediaIndices.update(r => ({
      ...r,
      [sectionIdx]: ((r[sectionIdx] ?? 0) + 1) % total,
    }));
  }

  private setupMarquee(track: HTMLElement): void {
    if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const halfWidth = track.scrollWidth / 2;
    if (halfWidth <= 0) return;

    gsap.set(track, { x: 0 });
    this.marqueeAnimation = gsap.to(track, {
      x: -halfWidth,
      duration: 22,
      ease: 'none',
      repeat: -1,
    });

    track.addEventListener('mouseenter', () => this.marqueeAnimation?.pause());
    track.addEventListener('mouseleave', () => this.marqueeAnimation?.resume());
  }
}