import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'
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
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
}
