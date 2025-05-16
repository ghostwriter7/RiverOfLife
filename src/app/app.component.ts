import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'
import { QuickMenuComponent } from '@app/components/quick-menu/quick-menu.component'
import { MenuComponent } from './components/menu/menu.component'
import { TopBarComponent } from './components/top-bar/top-bar.component'


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    TopBarComponent,
    MenuComponent,
    RouterOutlet,
    QuickMenuComponent,
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
}
