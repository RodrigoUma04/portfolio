import { afterNextRender, Directive, ElementRef, inject, input } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Directive({
  selector: '[appScrollReveal]',
})
export class ScrollRevealDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  readonly index = input(0);

  constructor() {
    afterNextRender(() => {
      const el = this.el.nativeElement;
      if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      gsap.set(el, { autoAlpha: 0, y: 32 });

      const alreadyVisible = el.getBoundingClientRect().top < window.innerHeight && window.scrollY === 0;

      if (alreadyVisible) {
        gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: this.index() * 0.12 });
      } else {
        gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top bottom' } });
      }
    });
  }
}