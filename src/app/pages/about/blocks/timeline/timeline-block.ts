import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TimelineData } from '../../../../services/about-blocks.service';

@Component({
  selector: 'app-timeline-block',
  imports: [TranslatePipe],
  templateUrl: './timeline-block.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineBlock {
  readonly data = input.required<TimelineData>();
}