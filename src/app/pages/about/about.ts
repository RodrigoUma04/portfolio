import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AboutBlocksService } from '../../services/about-blocks.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { HeadlineBlock } from './blocks/headline/headline-block';
import { BioBlock } from './blocks/bio/bio-block';
import { FactsBlock } from './blocks/facts/facts-block';
import { CardsBlock } from './blocks/cards/cards-block';
import { TimelineBlock } from './blocks/timeline/timeline-block';
import { CurrentsBlock } from './blocks/currents/currents-block';
import { QuoteBlock } from './blocks/quote/quote-block';
import { CtaBlock } from './blocks/cta/cta-block';

@Component({
  selector: 'app-about',
  imports: [ScrollRevealDirective, HeadlineBlock, BioBlock, FactsBlock, CardsBlock, TimelineBlock, CurrentsBlock, QuoteBlock, CtaBlock],
  templateUrl: './about.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  readonly blocks = inject(AboutBlocksService).blocks;
}
