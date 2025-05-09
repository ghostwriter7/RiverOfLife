import { DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'

type Cell = {
  date: Date;
  details: {
    climbing: boolean;
    sugarFree: boolean;
    mentalHealth: boolean;
  };
  isOdd: boolean;
  monthLabel?: string;
  state: CellState
};
type CellState = "success" | "failure" | "none";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
  ],
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  protected weeks: Cell[][] = [];

  protected readonly currentCell = signal<Cell | null>(null);
  protected readonly form = new FormGroup({
    climbing: new FormControl(false, { nonNullable: true }),
    sugarFree: new FormControl(false, { nonNullable: true }),
    mentalHealth: new FormControl(false, { nonNullable: true }),
  });

  private pointerPressMap = new Map<Cell, number>();

  private readonly detailsDialog = viewChild<ElementRef<HTMLDialogElement>>('details');

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

            const cell: Cell = {
              date,
              details: {
                climbing: false,
                sugarFree: false,
                mentalHealth: false,
              },
              state: 'none',
              isOdd: month % 2 !== 0
            };

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
      Object.keys(cell.details).forEach((key) => cell.details[key as keyof Cell['details']] = true);
      cell.state = 'success';
    } else if (cell.state === 'success') {
      Object.keys(cell.details).forEach((key) => cell.details[key as keyof Cell['details']] = false);
      cell.state = 'failure';
    } else {
      cell.state = 'none';
    }
  }

  private persistLogs(): void {
    const json = JSON.stringify(this.weeks);
    localStorage.setItem('weeks', json);
  }

  protected onTouchStart(day: Cell): void {
    this.pointerPressMap.set(day, Date.now());
  }

  protected onTouchEnd(event: TouchEvent, day: Cell): void {
    const startTime = this.pointerPressMap.get(day);
    if (startTime) {
      this.pointerPressMap.delete(day);
      const delta = Date.now() - startTime;
      if (delta > 300) {
        this.showDetails(event, day);
      }
    }
  }

  protected showDetails(event: Event, day: Cell): void {
    event.preventDefault();
    event.stopPropagation();
    this.currentCell.set(day);
    this.form.setValue(day.details);
    this.detailsDialog()?.nativeElement.showModal();
  }

  protected onDetailsClose(): void {
    const { value } = this.form;
    const currentCell = this.currentCell()!;
    currentCell.details = { ...value } as Required<typeof value>;
    this.currentCell.set(null);
    this.persistLogs();
  }
}
