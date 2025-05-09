import { DatePipe } from '@angular/common'
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    DatePipe
  ],
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  protected weeks: { date: Date, state: 'success' | 'failure' | 'none' }[][] = [];

  public ngOnInit(): void {
    const temporaryStart = new Date(2025, 4, 5, 12, 0, 0);
    const numberOfWeeks = 25;

    this.weeks = new Array(numberOfWeeks)
      .fill(0)
      .map((_, weekIndex) => {
        return new Array(7)
          .fill(0)
          .map((_, dayIndex) => {
            const date = new Date();
            date.setDate(temporaryStart.getDate() + (weekIndex * 7) + dayIndex);
            return { date, state: 'none' };
          });
      });

  }

  protected onCellClick (day: { date: Date; state: "success" | "failure" | "none" }): void {
    if (day.state === 'none') {
      day.state = 'success';
    } else if (day.state === 'success') {
      day.state = 'failure';
    } else {
      day.state = 'none';
    }
  }
}
