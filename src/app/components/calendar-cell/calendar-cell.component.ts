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

  constructor(protected readonly calendarService: CalendarService) {
  }

  protected onTouchStart(day: Cell): void {
    this.calendarService.handleTouchStart(day);
  }

  protected onTouchEnd(event: TouchEvent, day: Cell): void {
    this.calendarService.handleTouchEnd(event, day);
  }

  protected onRightClick(event: MouseEvent, day: Cell): void {
    this.calendarService.renderDetailsModal(event, day);
  }

  protected onCellClick(day: Cell): void {
    this.calendarService.handleCellClick(day);
  }
}
