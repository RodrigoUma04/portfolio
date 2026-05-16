import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import gsap from 'gsap';
import { SiteSettingsService } from '../../services/site-settings.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

type Role = 'recruiter' | 'engineer' | 'other';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, TranslatePipe, ScrollRevealDirective],
  templateUrl: './contact.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  protected readonly siteSettings = inject(SiteSettingsService).settings;

  private readonly submitBtnRef = viewChild.required<ElementRef<HTMLButtonElement>>('submitBtnRef');

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: [null as Role | null, Validators.required],
    message: ['', Validators.required],
  });

  copied = signal(false);
  roleType = signal<Role | null>(null);
  submitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal<string | null>(null);

  copyEmail() {
    const email = this.siteSettings()?.email ?? '';
    navigator.clipboard.writeText(email).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  setRole(role: Role, event: MouseEvent) {
    this.roleType.set(role);
    this.form.patchValue({ role });
    const btn = event.currentTarget as HTMLElement;
    gsap.fromTo(
      btn,
      { scale: 1 },
      { scale: 1.05, duration: 0.1, ease: 'power2.out', yoyo: true, repeat: 1 },
    );
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      gsap.fromTo(
        this.submitBtnRef().nativeElement,
        { x: 0 },
        { x: 10, duration: 0.07, ease: 'power2.inOut', yoyo: true, repeat: 5 },
      );
      return;
    }
    this.submitting.set(true);
    this.submitError.set(null);
    this.http
      .post('https://api.web3forms.com/submit', {
        access_key: 'faa5fc1b-b654-4258-91d1-0c73067744b0',
        ...this.form.value,
      })
      .subscribe({
        next: () => {
          this.submitSuccess.set(true);
          this.submitting.set(false);
        },
        error: () => {
          this.submitError.set('error');
          this.submitting.set(false);
        },
      });
  }
}