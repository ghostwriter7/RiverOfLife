import { CellState } from '../types/cell-state.type'
import { CellDetails } from './cell-details.interface'

export interface Cell {
  date: Date;
  dayIndex: number;
  details: CellDetails;
  isOdd: boolean;
  monthLabel?: string;
  state: CellState;
  weekIndex: number;
}
