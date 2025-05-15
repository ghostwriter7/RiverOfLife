import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router'
import { MenuService } from '@app/services/menu/menu.service'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-menu',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  protected readonly menuLinks = [
    { label: 'New Stream', route: '/new' },
    { label: 'Streams', route: '/streams' }
  ];
  protected readonly isActive: Signal<boolean>;

  constructor(
    private readonly menuService: MenuService) {
    this.isActive = menuService.$isActive;
  }

  protected close(): void {
    this.menuService.hideMenu();
  }
}
