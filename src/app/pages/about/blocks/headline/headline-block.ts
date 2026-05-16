import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AccentPipe } from '../../../../pipes/accent.pipe';
import { HeadlineData } from '../../../../services/about-blocks.service';

@Component({
  selector: 'app-headline-block',
  imports: [AccentPipe],
  templateUrl: './headline-block.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadlineBlock {
  readonly data = input.required<HeadlineData>();
}