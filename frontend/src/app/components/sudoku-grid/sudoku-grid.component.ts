import { Component,ViewChildren,QueryList,ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sudoku-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sudoku-grid.component.html',
  styleUrls: ['./sudoku-grid.component.css']
})
export class SudokuGridComponent {
  onInput(event: Event, row: number, col: number): void {
    const input = event.target as HTMLInputElement;

    const value = input.value.replace(/[^1-9]/g, '');

    input.value = value;

    this.grid[row][col] = value ? Number(value) : null;
  }
  onKeyDown(event: KeyboardEvent, row: number, col: number) {

    let newRow = row;
    let newCol = col;

    switch (event.key) {

      case 'ArrowUp':
        event.preventDefault();
        newRow = Math.max(0, row - 1);
        break;

      case 'ArrowDown':
        event.preventDefault();
        newRow = Math.min(8, row + 1);
        break;

      case 'ArrowLeft':
        event.preventDefault();
        newCol = Math.max(0, col - 1);
        break;

      case 'ArrowRight':
        event.preventDefault();
        newCol = Math.min(8, col + 1);
        break;

      default:
        return;
    }

    const index = newRow * 9 + newCol;

    this.cells.get(index)?.nativeElement.focus();
  }

  
  rows = Array.from({ length: 9 }, (_, i) => i);
  cols = Array.from({ length: 9 }, (_, i) => i);
  
  grid: (number | null)[][] = Array.from(
    { length: 9 },
    () => Array(9).fill(null)
  );
  @ViewChildren('cell')
  cells!: QueryList<ElementRef<HTMLInputElement>>;

  getGrid(): number[][] {

  return this.grid.map(row =>
    row.map(cell => cell ? Number(cell) : 0)
  );

}

setGrid(solution: number[][]) {

  this.grid = solution;

}

resetGrid() {

  this.grid = Array.from(
    { length: 9 },
    () => Array(9).fill(null)
  );

}

}