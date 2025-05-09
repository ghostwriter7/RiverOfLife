import { DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Cell } from '../../interfaces/cell.interface'
import { CalendarService } from '../../services/calendar/calendar.service'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-calendar-cell',
  imports: [
    DatePipe
  ],
  templateUrl: './calendar-cell.component.html',
  styleUrl: './calendar-cell.component.css'
})
export class CalendarCellComponent {
  public cell = input.required<Cell>();

  constructor(private readonly calendarService: CalendarService) {
  }

  protected onClick(day: Cell): void {
    this.calendarService.renderDetailsModal(day);
  }
}
