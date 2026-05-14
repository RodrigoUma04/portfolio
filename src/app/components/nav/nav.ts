import { ChangeDetectionStrategy, Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-nav',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './nav.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Nav {
  protected readonly links = [
    { label: 'HOME', route: '/home', exact: true },
    { label: 'WORK', route: '/work', exact: false },
    { label: 'ABOUT', route: '/about', exact: false },
    { label: 'CONTACT', route: '/contact', exact: false },
  ];
}
