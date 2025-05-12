import { Component, computed, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-calendar',
  imports: [],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  protected readonly header = computed(() => {
    const date = new Date(this.currentYear(), this.currentMonth(), 1);
    return Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
  });
  protected readonly currentMonth = signal<number>(0);
  protected readonly currentYear = signal<number>(0);

  public ngOnInit(): void {
    const now = new Date();
    this.currentMonth.set(now.getMonth());
    this.currentYear.set(now.getFullYear());

  }

  protected showNextMonth(): void {
    const currentMonth = this.currentYear();

    if (currentMonth === 11) {
      this.currentMonth.set(0);
      this.currentYear.update((year) => year + 1);
    } else {
      this.currentMonth.update((month) => month + 1);
    }
  }

  protected showPreviousMonth(): void {
    const currentMonth = this.currentMonth();

    if (currentMonth === 0) {
      this.currentMonth.set(11);
      this.currentYear.update((year) => year - 1);
    } else {
      this.currentMonth.update((month) => month - 1);
    }
  }
}
