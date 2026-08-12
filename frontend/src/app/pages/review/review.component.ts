import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoService } from '../../core/services/crypto.service';
import { SudokuService } from '../../core/services/sudoku.service';
import { SudokuGridComponent } from '../../components/sudoku-grid/sudoku-grid.component';

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

interface SudokuConfig {
  gridSize: number;
  boxRows: number;
  boxCols: number;
}

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, SudokuGridComponent],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit, OnDestroy {

  imageUrl: string | null = null;
  imageFile: File | null = null;
  detectedBoard: number[][] = [];
  fragments: SudokuFragments | null = null;
  config: SudokuConfig = {
    gridSize: 9,
    boxRows: 3,
    boxCols: 3
  };
  fragmentSubscription: any;


  navigateToUpload() {
    this.router.navigate(['/upload'], { fragment: this.cryptoService.encrypt(this.fragments) });
  }

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
      if (this.fragments.image) {
        this.imageUrl = this.fragments.image.image;

        this.imageFile = this.cryptoService.base64ToFile(
          this.fragments.image.image,
          this.fragments.image.imageName ?? 'sudoku-image.jpg'
        );
      }

      if (this.fragments.extractedGrid) {
        this.detectedBoard = this.sudokuService.cloneGrid(
          this.fragments.extractedGrid
        );
      }
      
      const gridSize = Number(data.selectedSize.split('×')[0]);

      this.config = this.sudokuService.gridConfig(gridSize);

    });
  }

  onBoardChanged(board: number[][]): void {
    this.detectedBoard =
      this.sudokuService.cloneGrid(board);

  }

  continueToSolve(): void {

    if (!this.detectedBoard.length) {
      return;
    }

    this.router.navigate(['/solve'], { fragment: this.cryptoService.encrypt(this.fragments) });
  }

  private getFragments(): SudokuFragments | null {

    const stored =
      localStorage.getItem('fragments');

    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as SudokuFragments;
    } catch (error) {
      console.error(
        'Failed to parse fragments:',
        error
      );

      return null;
    }
  }

  ngOnDestroy(): void {
    this.fragmentSubscription.unsubscribe();
  }
}
