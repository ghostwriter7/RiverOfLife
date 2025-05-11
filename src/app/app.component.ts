import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterOutlet } from '@angular/router'
import { MenuComponent } from './components/menu/menu.component'
import { TopBarComponent } from './components/top-bar/top-bar.component'
import { Cell } from './interfaces/cell.interface'
import { CalendarService } from './services/calendar/calendar.service'


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TopBarComponent,
    MenuComponent,
    RouterOutlet,
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected readonly weeks: Signal<Cell[][]>;

  constructor(private readonly calendarService: CalendarService) {
    this.weeks = this.calendarService.$tableData;
  }
}
