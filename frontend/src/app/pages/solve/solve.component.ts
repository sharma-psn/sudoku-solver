import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SudokuGridComponent } from '../../components/sudoku-grid/sudoku-grid.component';
import { SudokuService } from '../../core/services/sudoku.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoService } from '../../core/services/crypto.service';

interface SudokuConfig {
  gridSize: number;
  boxRows: number;
  boxCols: number;
}

@Component({
  selector: 'app-solve',
  standalone: true,
  imports: [SudokuGridComponent],
  templateUrl: './solve.component.html',
  styleUrl: './solve.component.css'
})
export class SolveComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private cryptoService: CryptoService,
    private router: Router,
    private sudokuService: SudokuService
  ) { }

  ngOnInit(): void {

    this.fragmentSubscription = this.route.fragment.subscribe(fragment => {

      if (!fragment) {
        return;
      }

      const data = this.cryptoService.decrypt(fragment) as {
        gameType: string;
        selectedType: string;
        inputMethod: string;
        selectedSize: string;
      };

      this.fragments = data;
      console.log(data, this.fragments);

      const gridSize = Number(data.selectedSize.split('×')[0]);

      this.config.gridSize = gridSize;

      if (Number.isInteger(Math.sqrt(gridSize))) {

        this.config.boxRows = Math.sqrt(gridSize);
        this.config.boxCols = Math.sqrt(gridSize);

      } else {

        for (let i = Math.floor(Math.sqrt(gridSize)); i >= 2; i--) {

          if (gridSize % i === 0) {

            this.config.boxRows = i;
            this.config.boxCols = gridSize / i;

            break;
          }
        }

      }

      console.log(this.config);

    });

  }

  config: SudokuConfig = {
    gridSize: 9,
    boxRows: 3,
    boxCols: 3
  };

  fragments!: { gameType: string; selectedType: string; inputMethod: string; selectedSize: string; };

  fragmentSubscription: any;

  @ViewChild(SudokuGridComponent)
  sudokuGrid!: SudokuGridComponent;

  loading = false;

  solvePuzzle() {

    this.loading = true;

    const grid = this.sudokuGrid.getGrid();

    this.sudokuService.solve(grid, this.config).subscribe({

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

  navigateToSelection() {
    this.router.navigate(['/selection'], { fragment: this.cryptoService.encrypt(this.fragments) });
  }

  ngOnDestroy(): void {
    this.fragmentSubscription.unsubscribe();
  }

}