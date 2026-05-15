import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import gsap from 'gsap';
import { SiteSettingsService } from '../../services/site-settings.service';

type Role = 'recruiter' | 'engineer' | 'other';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './contact.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact implements AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  protected readonly siteSettings = inject(SiteSettingsService).settings;

  @ViewChild('heroRef') private readonly heroRef!: ElementRef<HTMLElement>;
  @ViewChild('emailCardRef') private readonly emailCardRef!: ElementRef<HTMLElement>;
  @ViewChild('formSectionRef') private readonly formSectionRef!: ElementRef<HTMLElement>;
  @ViewChild('submitBtnRef') private readonly submitBtnRef!: ElementRef<HTMLButtonElement>;

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

  ngAfterViewInit() {
    const els = [
      this.heroRef.nativeElement,
      this.emailCardRef.nativeElement,
      this.formSectionRef.nativeElement,
    ];
    gsap.set(els, { autoAlpha: 0, y: 24 });
    gsap.to(els, {
      autoAlpha: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.12,
    });
  }

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
        this.submitBtnRef.nativeElement,
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