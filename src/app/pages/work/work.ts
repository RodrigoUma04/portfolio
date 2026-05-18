import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import gsap from 'gsap';
import { ProjectViewModel, ProjectsService } from '../../services/projects.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

type Filter = 'all' | 'year';

interface YearGroup {
  year: string;
  projects: ProjectViewModel[];
}

@Component({
  selector: 'app-work',
  imports: [NgTemplateOutlet, ScrollRevealDirective, TranslatePipe],
  templateUrl: './work.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col flex-1 select-none' },
})
export class Work implements AfterViewInit, OnDestroy {
  @ViewChild('previewEl') previewElRef!: ElementRef<HTMLElement>;

  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly router = inject(Router);
  private readonly projectsService = inject(ProjectsService);

  protected readonly filter = signal<Filter>('all');
  protected readonly previewProject = signal<ProjectViewModel | null>(null);
  protected readonly previewImageIndex = signal(0);

  private xTo!: (x: number) => void;
  private yTo!: (y: number) => void;
  private carouselInterval: ReturnType<typeof setInterval> | null = null;

  protected readonly allProjects = this.projectsService.projects;

  protected readonly yearGroups = computed<YearGroup[]>(() => {
    const projects = this.allProjects();
    const map = new Map<string, ProjectViewModel[]>();
    for (const p of projects) {
      const key = p.year.replace('+', '');
      if (!map.has(key)) map.set(key, []);
      map.get(key)?.push(p);
    }
    return [...map.entries()]
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, ps]) => ({ year, projects: ps }));
  });

  protected readonly previewSrc = computed(() => {
    const p = this.previewProject();
    if (!p?.preview.length) return '';
    return p.preview[this.previewImageIndex() % p.preview.length];
  });

  ngAfterViewInit() {
    const previewEl = this.previewElRef.nativeElement;
    gsap.set(previewEl, { autoAlpha: 0, xPercent: 0, yPercent: 0 });

    if (!globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.xTo = gsap.quickTo(previewEl, 'x', { duration: 0.35, ease: 'power3.out' }) as unknown as (x: number) => void;
      this.yTo = gsap.quickTo(previewEl, 'y', { duration: 0.35, ease: 'power3.out' }) as unknown as (y: number) => void;
    }

    const targets = this.elRef.nativeElement.querySelectorAll('.hero-animate');
    if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }
    gsap.set(targets, { opacity: 0, y: 20 });
    gsap.to(targets, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' });
  }

  ngOnDestroy() {
    this.clearCarousel();
  }

  protected setFilter(f: Filter) {
    this.filter.set(f);
  }

  protected showPreview(project: ProjectViewModel, event: MouseEvent) {
    this.previewProject.set(project);
    this.previewImageIndex.set(0);
    gsap.to(this.previewElRef.nativeElement, { autoAlpha: 1, duration: 0.18 });
    this.movePreview(event);
    this.startCarousel(project);
  }

  protected movePreview(event: MouseEvent) {
    if (this.xTo && this.yTo) {
      this.xTo(event.clientX + 24);
      this.yTo(event.clientY + 24);
    }
  }

  protected hidePreview() {
    this.clearCarousel();
    gsap.to(this.previewElRef.nativeElement, { autoAlpha: 0, duration: 0.15 });
    this.previewProject.set(null);
  }

  protected navigateTo(slug: string) {
    void this.router.navigate(['/work', slug]);
  }

  private startCarousel(project: ProjectViewModel) {
    this.clearCarousel();
    if (project.preview.length <= 1) return;
    this.carouselInterval = setInterval(() => {
      this.previewImageIndex.update(i => i + 1);
    }, 3000);
  }

  private clearCarousel() {
    if (this.carouselInterval !== null) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = null;
    }
  }

  protected visibleChips(stack: ProjectViewModel['stack']) {
    return stack.slice(0, 4);
  }

  protected overflowCount(stack: ProjectViewModel['stack']) {
    return Math.max(0, stack.length - 4);
  }
}
