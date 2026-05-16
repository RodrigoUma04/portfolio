import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { QuoteData } from '../../../../services/about-blocks.service';

@Component({
  selector: 'app-quote-block',
  templateUrl: './quote-block.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteBlock {
  readonly data = input.required<QuoteData>();
}