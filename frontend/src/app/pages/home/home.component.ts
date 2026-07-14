import { Component, ViewChild } from '@angular/core';
import { SudokuGridComponent } from '../../components/sudoku-grid/sudoku-grid.component';
import { SudokuService } from '../../core/services/sudoku.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SudokuGridComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  @ViewChild(SudokuGridComponent)
  sudokuGrid!: SudokuGridComponent;

  loading = false;

  constructor(private sudokuService: SudokuService) {}

  solvePuzzle() {

    this.loading = true;

    const grid = this.sudokuGrid.getGrid();

    this.sudokuService.solve(grid).subscribe({
      
      next: (response) => {
        console.log('Backend Response:', response);

        this.loading = false;

        this.sudokuGrid.setGrid(response.grid);

      },

      error: (err) => {

        this.loading = false;

        alert(err.error.message);

      }

    });

  }

  resetPuzzle() {

    this.sudokuGrid.resetGrid();

  }

}