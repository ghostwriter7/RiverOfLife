import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Cell } from '../../interfaces/cell.interface'
import { CalendarCellComponent } from '../calendar-cell/calendar-cell.component'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-calendar-table',
  imports: [
    CalendarCellComponent
  ],
  templateUrl: './calendar-table.component.html',
  styleUrl: './calendar-table.component.css'
})
export class CalendarTableComponent {
  public weeks = input.required<Cell[][]>();
}
