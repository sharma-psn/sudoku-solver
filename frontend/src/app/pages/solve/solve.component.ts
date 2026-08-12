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

interface SudokuFragments {
  gameType: string;
  selectedType: string;
  inputMethod: string;
  selectedSize: string;

  image?: {
    image: string;
    imageName: string;
    imageType: string;
  };
  imageName?: string;
  imageType?: string;

  extractedGrid?: number[][];
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

      this.config = this.sudokuService.gridConfig(gridSize);

      if (this.fragments.extractedGrid) {
        this.detectedBoard = this.sudokuService.cloneGrid(
          this.fragments.extractedGrid
        );
        setTimeout(() => {
          this.solvePuzzle();
        }, 100);
      }
      console.log(this.config);

    });

  }

  config: SudokuConfig = {
    gridSize: 9,
    boxRows: 3,
    boxCols: 3
  };

  fragments!: SudokuFragments;

  fragmentSubscription: any;

  @ViewChild(SudokuGridComponent)
  sudokuGrid!: SudokuGridComponent;
  detectedBoard: number[][] = [];
  loading = false;

  solvePuzzle() {

    this.loading = true;

    const grid = this.sudokuGrid.getGrid();

    this.sudokuService.solve(grid, this.config).subscribe((response) => {

      this.loading = false;
      if (response.success) {
        this.sudokuGrid.setGrid(response.grid);
      } else {
        alert(response.message);
      }
    });

  }

  resetPuzzle() {

    this.sudokuGrid.resetGrid();

  }

  navigateToSelection() {
    if (this.fragments.image) {
      this.router.navigate(['/review'], { fragment: this.cryptoService.encrypt(this.fragments) });
    }
    else {
      this.router.navigate(['/selection'], { fragment: this.cryptoService.encrypt(this.fragments) });
    }
  }

  ngOnDestroy(): void {
    this.fragmentSubscription.unsubscribe();
  }

}