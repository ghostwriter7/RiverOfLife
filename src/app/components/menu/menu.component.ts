import { Component, Signal } from '@angular/core';
import { MenuService } from '../../services/menu/menu.service'

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  protected readonly isActive: Signal<boolean>;

  constructor(private readonly menuService: MenuService) {
    this.isActive = menuService.$isActive;
  }

  protected close(): void {
    this.menuService.hideMenu();
  }
}
