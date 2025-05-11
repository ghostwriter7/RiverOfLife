import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuService } from '../../services/menu/menu.service'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-top-bar',
  imports: [],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent {
  constructor(private readonly menuService: MenuService) {
  }

  protected open(): void {
    this.menuService.showMenu();
  }
}
