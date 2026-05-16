import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CardsData } from '../../../../services/about-blocks.service';

const COLS_MAP: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

@Component({
  selector: 'app-cards-block',
  imports: [TranslatePipe],
  templateUrl: './cards-block.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsBlock {
  readonly data = input.required<CardsData>();

  readonly gridCols = computed(() => COLS_MAP[this.data().cols ?? 4] ?? COLS_MAP[4]);
}