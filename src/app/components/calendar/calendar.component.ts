import { NgClass } from '@angular/common'
import { ChangeDetectionStrategy, Component, computed, effect, input, Signal, } from '@angular/core';
import { StreamService } from '../../services/stream/stream.service';

interface DayData {
  date: number;
  weekIndex: number;
  isToday?: boolean;
  state: number;
  className: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  imports: [NgClass],
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  public readonly streamId = input.required<string>();

  protected readonly header = computed(() => {
    const date = new Date(this.currentYear(), this.currentMonth(), 1);
    return Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
  });
  protected readonly dates = computed<DayData[]>(() => {
    const month = this.currentMonth();
    const year = this.currentYear();

    const firstDayWeekIndex = new Date(year, month, 1).getDay();
    const adjustedFirstDayIndex = firstDayWeekIndex === 0 ? 7 : firstDayWeekIndex;

    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const today = now.getDate();

    return this.streamService.$monthData()
      .map((state, index) => {
        const date = index + 1;
        return {
          date,
          isToday: thisMonth === month && thisYear === year && date === today,
          weekIndex: ((adjustedFirstDayIndex + index - 1) % 7) + 1,
          state,
          className: state === 1 ? 'none' : state === 2 ? 'success' : 'failure'
        };
      });
  });
  protected readonly weekLabels = new Array(7).fill(0).map((_, index) =>
    Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(2025, 4, index + 5))
  );

  private readonly currentYear: Signal<number>;
  private readonly currentMonth: Signal<number>;

  constructor(private readonly streamService: StreamService) {
    this.currentMonth = streamService.$currentMonth;
    this.currentYear = streamService.$currentYear;

    effect(() => this.streamService.setStreamId(this.streamId()));
  }

  protected showNextMonth(): void {
    this.streamService.showNextMonth();
  }

  protected showPreviousMonth(): void {
    this.streamService.showPreviousMonth();
  }

  protected onDayClick(day: DayData): void {
    const newState = ((day.state || 0) + 1) % 3;
    this.streamService.updateDay(day.date, newState);
  }
}
