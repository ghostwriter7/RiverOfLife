import { DatePipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  Signal,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { CellDetails } from '../../interfaces/cell-details.interface'
import { Cell } from '../../interfaces/cell.interface'
import { DialogComponent } from '../../interfaces/dialog-component.interface'
import { CalendarService } from '../../services/calendar/calendar.service'
import { DialogService } from '../../services/dialog/dialog.service'
import { CellDetailsFormGroup } from '../../types/cell-details-form-group.type'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-details-dialog',
  imports: [
    DatePipe,
    ReactiveFormsModule
  ],
  templateUrl: './details-dialog.component.html',
  styleUrl: './details-dialog.component.css'
})
export class DetailsDialogComponent implements OnInit, DialogComponent<CellDetails> {
  @ViewChild('details', { static: true }) private readonly dialogRef!: ElementRef<HTMLDialogElement>;

  protected readonly currentCell: Signal<Cell | null>;
  protected readonly form: CellDetailsFormGroup = new FormGroup({
    climbing: new FormControl(false, { nonNullable: true }),
    sugarFree: new FormControl(false, { nonNullable: true }),
    mentalHealth: new FormControl(false, { nonNullable: true }),
  });

  constructor(
    private readonly dialogService: DialogService,
    private readonly calendarService: CalendarService) {
    this.currentCell = calendarService.$currentCell;
  }

  public ngOnInit(): void {
    this.dialogService.register(DetailsDialogComponent, this);
  }

  public open(cellDetails: CellDetails): void {
    this.form.setValue(cellDetails);
    this.dialogRef.nativeElement.showModal();
  }

  public close(): void {
    this.dialogRef.nativeElement.close();
    const cellDetails = { ...this.form.value } as CellDetails;
    this.calendarService.updateCell(cellDetails);
  }
}
