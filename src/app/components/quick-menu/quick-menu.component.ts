import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-quick-menu',
  imports: [
    RouterLink
  ],
  templateUrl: './quick-menu.component.html',
  styleUrl: './quick-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickMenuComponent {

}
