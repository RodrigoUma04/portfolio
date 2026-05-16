import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AccentPipe } from '../../../../pipes/accent.pipe';
import { CtaData } from '../../../../services/about-blocks.service';

@Component({
  selector: 'app-cta-block',
  imports: [RouterLink, TranslatePipe, AccentPipe],
  templateUrl: './cta-block.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CtaBlock {
  readonly data = input.required<CtaData>();
}