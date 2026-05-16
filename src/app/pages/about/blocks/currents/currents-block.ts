import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CurrentsData } from '../../../../services/about-blocks.service';

const COLS_MAP: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
};

@Component({
  selector: 'app-currents-block',
  imports: [TranslatePipe],
  templateUrl: './currents-block.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentsBlock {
  readonly data = input.required<CurrentsData>();

  readonly gridCols = computed(() => COLS_MAP[this.data().columns.length] ?? COLS_MAP[3]);
}