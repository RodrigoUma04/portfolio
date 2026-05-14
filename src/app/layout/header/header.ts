import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Nav } from '../../components/nav/nav';

@Component({
  selector: 'app-header',
  imports: [Nav],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected isMenuOpen = signal(false);

  protected toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
