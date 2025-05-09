import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CalendarTableComponent } from './components/calendar-table/calendar-table.component'
import { DetailsDialogComponent } from './components/details-dialog/details-dialog.component'
import { Cell } from './interfaces/cell.interface'
import { CalendarService } from './services/calendar/calendar.service'


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CalendarTableComponent,
    DetailsDialogComponent,
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected readonly weeks: Signal<Cell[][]>;

  constructor(private readonly calendarService: CalendarService) {
    this.weeks = this.calendarService.$tableData;
  }
}
