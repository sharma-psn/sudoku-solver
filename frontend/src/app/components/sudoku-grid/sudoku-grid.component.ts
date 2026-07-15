import {
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sudoku-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sudoku-grid.component.html',
  styleUrls: ['./sudoku-grid.component.css']
})
export class SudokuGridComponent implements OnInit {
  onValueChange(value: any, row: number, col: number): void {

    if (value === '') {
      this.grid[row][col] = null;
      return;
    }

    const number = Number(value);

    if (number >= 1 && number <= this.config.gridSize) {
      this.grid[row][col] = number;
    } else {
      this.grid[row][col] = null;
    }

  }

  @Input({ required: true }) config!: {
    gridSize: number;
    boxRows: number;
    boxCols: number;
  };

  @ViewChildren('cell')
  cells!: QueryList<ElementRef<HTMLInputElement>>;

  grid: (number | null)[][] = [];

  originalCells: boolean[][] = [];

  generatedCells: boolean[][] = [];

  cellSize = 55;

  fontSize = 22;

  ngOnInit(): void {

    this.createGrid();

    this.calculateCellSize();

  }

  private createGrid(): void {

    this.grid = Array.from(
      { length: this.config.gridSize },
      () => Array(this.config.gridSize).fill(null)
    );

    this.originalCells = Array.from(
      { length: this.config.gridSize },
      () => Array(this.config.gridSize).fill(false)
    );

    this.generatedCells = Array.from(
      { length: this.config.gridSize },
      () => Array(this.config.gridSize).fill(false)
    );

  }

  private calculateCellSize(): void {

    const size = this.config.gridSize;

    if (size <= 4) {
      this.cellSize = 70;
      this.fontSize = 26;
    }
    else if (size <= 9) {
      this.cellSize = 55;
      this.fontSize = 22;
    }
    else if (size <= 12) {
      this.cellSize = 46;
      this.fontSize = 18;
    }
    else if (size <= 16) {
      this.cellSize = 38;
      this.fontSize = 16;
    }
    else if (size <= 20) {
      this.cellSize = 32;
      this.fontSize = 14;
    }
    else if (size <= 25) {
      this.cellSize = 26;
      this.fontSize = 12;
    }
    else {
      this.cellSize = 20;
      this.fontSize = 10;
    }
  }

  onInput(event: Event, row: number, col: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');
    console.log(value, row, col, this.grid);
    if (!value) {
      input.value = '';
      this.grid[row][col] = null;
      return;
    }
    const number = Number(value);
    if (number < 1 || number > this.config.gridSize) {
      input.value = '';
      this.grid[row][col] = null;
      return;
    }
    input.value = number.toString();
    this.grid[row][col] = number;
  }

  onKeyDown(event: KeyboardEvent, row: number, col: number): void {
    let nextRow = row;
    let nextCol = col;
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        nextRow = Math.max(0, row - 1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        nextRow = Math.min(this.config.gridSize - 1, row + 1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        nextCol = Math.max(0, col - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        nextCol = Math.min(this.config.gridSize - 1, col + 1);
        break;
      default:
        return;
    }
    const index = nextRow * this.config.gridSize + nextCol;
    this.cells.get(index)?.nativeElement.focus();
  }

  isRightBorder(col: number): boolean {

    return (
      (col + 1) % this.config.boxCols === 0 &&
      col !== this.config.gridSize - 1
    );

  }

  isBottomBorder(row: number): boolean {

    return (
      (row + 1) % this.config.boxRows === 0 &&
      row !== this.config.gridSize - 1
    );

  }

  getGrid(): number[][] {

    return this.grid.map(row =>
      row.map(cell => cell ?? 0)
    );

  }

  setGrid(solution: number[][]): void {

    this.grid = solution.map(row => [...row]);

    this.generatedCells = this.grid.map(row =>
      row.map(value => value !== null && value !== 0)
    );

  }

  setPuzzle(puzzle: number[][]): void {

    this.grid = puzzle.map(row =>
      row.map(value => value === 0 ? null : value)
    );

    this.originalCells = this.grid.map(row =>
      row.map(value => value !== null)
    );

    this.generatedCells = Array.from(
      { length: this.config.gridSize },
      () => Array(this.config.gridSize).fill(false)
    );

  }

  resetGrid(): void {

    this.createGrid();

  }

}