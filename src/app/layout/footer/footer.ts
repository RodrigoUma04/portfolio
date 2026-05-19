import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AboutBlocksService, FactsData } from '../../services/about-blocks.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' }
})
export class Footer {
  private readonly aboutBlocks = inject(AboutBlocksService);

  readonly year = new Date().getFullYear();

  readonly location = computed(() => {
    const facts = this.aboutBlocks.blocks().find(b => b.type === 'facts');
    return (facts?.data as FactsData | undefined)?.items[0]?.value;
  });
}