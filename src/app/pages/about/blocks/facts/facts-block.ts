import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FactsData } from '../../../../services/about-blocks.service';

@Component({
  selector: 'app-facts-block',
  imports: [TranslatePipe],
  templateUrl: './facts-block.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FactsBlock {
  readonly data = input.required<FactsData>();
}