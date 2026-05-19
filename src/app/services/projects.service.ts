import { Injectable, Signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { LanguageService } from './language.service';
import { TechItem } from './home.service';
import { environment } from '../../environments/environment';

export interface ProjectSection {
  label: string;
  description: string;
  media: string[];
  video?: string;
}

export interface ProjectTranslation {
  title: string;
  role: string;
  team: string;
  description: string;
  sections: ProjectSection[];
  summary: string;
}

export interface Project {
  slug: string;
  type: string;
  year: string;
  status: 'published' | 'draft';
  inProgress: boolean;
  stack: TechItem[];
  preview: string[];
  en: ProjectTranslation;
  fr: ProjectTranslation;
  nl: ProjectTranslation;
  es: ProjectTranslation;
}

export interface ProjectViewModel extends Project {
  tag: string;
  t: ProjectTranslation;
}

interface ProjectsData {
  projects: Project[];
}

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly http = inject(HttpClient);
  private readonly languageService = inject(LanguageService);

  private readonly allData = toSignal(
    this.http.get<ProjectsData>('/data/projects.json'),
    { initialValue: null }
  );

  readonly projects = computed<ProjectViewModel[]>(() => {
    const data = this.allData();
    const lang = this.languageService.currentLang() as keyof Pick<Project, 'en' | 'fr' | 'nl' | 'es'>;
    if (!data) return [];
    const visible = environment.showDrafts
      ? data.projects
      : data.projects.filter(p => p.status === 'published');
    return visible.map((p, i) => ({
      ...p,
      tag: String(i + 1).padStart(2, '0'),
      t: p[lang] ?? p['en'],
    }));
  });

  projectBySlug(slug: Signal<string>) {
    return computed(() => this.projects().find(p => p.slug === slug()) ?? null);
  }
}
