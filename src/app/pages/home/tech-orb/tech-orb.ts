import { AfterRenderRef, ChangeDetectionStrategy, Component, ElementRef, afterEveryRender, inject, input } from '@angular/core';
import gsap from 'gsap';
import { TechItem } from '../../../services/home.service';

@Component({
  selector: 'app-tech-orb',
  templateUrl: './tech-orb.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class TechOrb {
  private readonly elRef = inject(ElementRef);
  outerRing = input<TechItem[]>([]);
  middleRing = input<TechItem[]>([]);
  innerRing = input<TechItem[]>([]);

  constructor() {
    let renderRef: AfterRenderRef;
    renderRef = afterEveryRender(() => {
      const el = this.elRef.nativeElement as HTMLElement;
      if (el.querySelectorAll('.icon-inner').length === 0) return;
      renderRef.destroy();
      this.startAnimation(el);
    });
  }

  private startAnimation(el: HTMLElement) {
    const container = el.querySelector<HTMLElement>('.orb-container') ?? el;
    const rings = el.querySelectorAll('.orb-ring');
    const innerSpans = Array.from(el.querySelectorAll<HTMLElement>('.icon-inner'));
    const middleSpans = Array.from(el.querySelectorAll<HTMLElement>('.icon-middle'));
    const outerSpans = Array.from(el.querySelectorAll<HTMLElement>('.icon-outer'));
    const innerBubbles = innerSpans.map(s => s.querySelector<HTMLElement>('.icon-bubble')!);
    const middleBubbles = middleSpans.map(s => s.querySelector<HTMLElement>('.icon-bubble')!);
    const outerBubbles = outerSpans.map(s => s.querySelector<HTMLElement>('.icon-bubble')!);
    const allBubbles = [...innerBubbles, ...middleBubbles, ...outerBubbles];

    const w = container.offsetWidth;

    innerSpans.forEach((s, i) => {
      s.style.setProperty('--orbit-r', `${w * 0.18}px`);
      s.style.animation = `orbit-cw 35s ${(-i / innerSpans.length * 35).toFixed(3)}s linear infinite`;
    });
    middleSpans.forEach((s, i) => {
      s.style.setProperty('--orbit-r', `${w * 0.34}px`);
      s.style.animation = `orbit-ccw 55s ${(-i / middleSpans.length * 55).toFixed(3)}s linear infinite`;
    });
    outerSpans.forEach((s, i) => {
      s.style.setProperty('--orbit-r', `${w * 0.48}px`);
      s.style.animation = `orbit-cw 75s ${(-i / outerSpans.length * 75).toFixed(3)}s linear infinite`;
    });

    if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set([rings, ...allBubbles], { opacity: 1 });
      return;
    }

    gsap.set(rings, { opacity: 0 });
    gsap.set(allBubbles, { opacity: 0, scale: 0.5 });

    gsap.timeline({ delay: 0.3 })
      .to(rings, { opacity: 1, duration: 0.8, ease: 'power2.out' })
      .to(innerBubbles, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.04, ease: 'back.out(1.7)' }, '-=0.5')
      .to(middleBubbles, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.04, ease: 'back.out(1.7)' }, '-=0.1')
      .to(outerBubbles, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.04, ease: 'back.out(1.7)' }, '-=0.1')
      .set(allBubbles, { clearProps: 'transform' });
  }
}
