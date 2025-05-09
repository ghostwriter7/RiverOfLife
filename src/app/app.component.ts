import { DatePipe } from '@angular/common'
import { Component, OnInit } from '@angular/core';

type Cell = { date: Date; monthLabel?: string; state: CellState };
type CellState = "success" | "failure" | "none";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    DatePipe
  ],
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  protected weeks: Cell[][] = [];

  public ngOnInit(): void {
    const storedWeeks = localStorage.getItem('weeks');
    if (storedWeeks) {
      try {
        this.weeks = JSON.parse(storedWeeks) as Cell[][];
      } catch (error) {
        console.error('Failed to parse stored weeks');
        console.error(error);
        this.initializeWeeksFromScratch();
      }
    } else {
      this.initializeWeeksFromScratch();
    }
  }

  protected onCellClick(cell: Cell): void {
    this.updateCellState(cell);
    this.persistLogs();
  }

  private initializeWeeksFromScratch(): void {
    const temporaryStart = new Date(2025, 4, 5, 12, 0, 0);
    const numberOfWeeks = 25;

    let previousMonth = 4;
    this.weeks = new Array(numberOfWeeks)
      .fill(0)
      .map((_, weekIndex) => {
        return new Array(7)
          .fill(0)
          .map((_, dayIndex) => {
            const date = new Date();
            date.setDate(temporaryStart.getDate() + (weekIndex * 7) + dayIndex);
            const month = date.getMonth();

            const cell: Cell = { date, state: 'none' };

            if (month !== previousMonth) {
              previousMonth = month;
              return { ...cell, monthLabel: date.toLocaleString('default', { month: 'long' }) } as Cell;
            }

            return cell;
          });
      });
  }

  private updateCellState(cell: Cell): void {
    if (cell.state === 'none') {
      cell.state = 'success';
    } else if (cell.state === 'success') {
      cell.state = 'failure';
    } else {
      cell.state = 'none';
    }
  }

  private persistLogs(): void {
    const json = JSON.stringify(this.weeks);
    localStorage.setItem('weeks', json);
  }
}
