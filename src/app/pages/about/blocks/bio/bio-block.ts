import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BioData } from '../../../../services/about-blocks.service';

@Component({
  selector: 'app-bio-block',
  templateUrl: './bio-block.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BioBlock {
  readonly data = input.required<BioData>();
}