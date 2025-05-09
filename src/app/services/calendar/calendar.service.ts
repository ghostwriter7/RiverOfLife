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

  public renderDetailsModal(day: Cell): void {
    this.currentCell.set(day);
    this.dialogService.open<DialogComponent<CellDetails>>(DetailsDialogComponent, day.details);
  }

  public updateCell(cellDetails: CellDetails): void {
    const currentCell = this.currentCell()!;
    const allPassed = Object.values(cellDetails).every(Boolean);
    const { date } = currentCell;
    const isPassedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())[Symbol.toPrimitive]('number')
      < new Date().setHours(0, 0, 0, 0);

    this.tableData.update((tableData) =>
      tableData.with(currentCell.weekIndex, tableData[currentCell.weekIndex].with(currentCell.dayIndex, {
        ...currentCell,
        details: cellDetails,
        state: allPassed ? 'success' : isPassedDate ? 'failure' : 'none'
      })));

    this.currentCell.set(null);
    this.persistLogs();
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
              dayIndex,
              details: {
                climbing: false,
                sugarFree: false,
                mentalHealth: false,
              },
              state: 'none',
              isOdd: month % 2 !== 0,
              weekIndex
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
        return (JSON.parse(storedWeeks) as TableData)
          .map((weeks) => weeks
            .map((day) => ({ ...day, date: new Date(day.date) })));
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
