import { Injectable, Signal, signal } from '@angular/core'
import { DetailsDialogComponent } from '../../components/details-dialog/details-dialog.component'
import { CellDetails } from '../../interfaces/cell-details.interface'
import { Cell } from '../../interfaces/cell.interface'
import { DialogComponent } from '../../interfaces/dialog-component.interface'
import { TableData } from '../../types/table-data.type'
import { DialogService } from '../dialog/dialog.service'

@Injectable({ providedIn: 'root' })
export class CalendarService {
  public readonly $tableData: Signal<TableData>;
  public readonly $currentCell: Signal<Cell | null>;

  private readonly currentCell = signal<Cell | null>(null);
  private readonly tableData = signal<TableData>(this.getTableDate());

  constructor(
    private readonly dialogService: DialogService) {
    this.$tableData = this.tableData.asReadonly();
    this.$currentCell = this.currentCell.asReadonly();
  }

  private pointerPressMap = new Map<Cell, number>();

  public handleCellClick(cell: Cell): void {
    this.updateCellState(cell);
    this.persistLogs();
  }

  public handleTouchEnd(event: TouchEvent, day: Cell): void {
    const startTime = this.pointerPressMap.get(day);
    if (startTime) {
      this.pointerPressMap.delete(day);
      const delta = Date.now() - startTime;
      if (delta > 300) {
        this.renderDetailsModal(event, day);
      }
    }
  }

  public handleTouchStart(day: Cell): void {
    this.pointerPressMap.set(day, Date.now());
  }

  public renderDetailsModal(event: Event, day: Cell): void {
    event.preventDefault();
    event.stopPropagation();
    this.currentCell.set(day);
    this.dialogService.open<DialogComponent<CellDetails>>(DetailsDialogComponent, day.details);
  }

  public updateCell(cellDetails: CellDetails): void {
    const currentCell = this.currentCell()!;
    currentCell.details = cellDetails;
    this.currentCell.set(null);
    this.persistLogs();
  }

  private updateCellState(cell: Cell): void {
    if (cell.state === 'none') {
      Object.keys(cell.details).forEach((key) => cell.details[ key as keyof Cell['details'] ] = true);
      cell.state = 'success';
    } else if (cell.state === 'success') {
      Object.keys(cell.details).forEach((key) => cell.details[ key as keyof Cell['details'] ] = false);
      cell.state = 'failure';
    } else {
      cell.state = 'none';
    }
  }

  private persistLogs(): void {
    const json = JSON.stringify(this.$tableData());
    localStorage.setItem('weeks', json);
  }

  private createBlankTableData(): TableData {
    const temporaryStart = new Date(2025, 4, 5, 12, 0, 0);
    const numberOfWeeks = 25;

    let previousMonth = 4;
    return new Array(numberOfWeeks)
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

  private getTableDate(): TableData {
    const storedWeeks = localStorage.getItem('weeks');
    if (storedWeeks) {
      try {
        return JSON.parse(storedWeeks) as TableData;
      } catch (error) {
        console.error('Failed to parse stored weeks');
        console.error(error);
        return this.createBlankTableData();
      }
    } else {
      return this.createBlankTableData();
    }
  }
}
