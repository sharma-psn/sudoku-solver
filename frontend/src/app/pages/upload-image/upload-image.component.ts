import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CryptoService } from '../../core/services/crypto.service';
import { SudokuService } from '../../core/services/sudoku.service';

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
  selector: 'app-upload-image',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit, OnDestroy {

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  isUploading = false;

  constructor(
    private route: ActivatedRoute,
    private cryptoService: CryptoService,
    private router: Router,
    private sudokuService: SudokuService
  ) { }

  navigateToSelection() {
    this.router.navigate(['/selection'], { fragment: this.cryptoService.encrypt(this.fragments) });
  }

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

      const gridSize = Number(data.selectedSize.split('×')[0]);

      this.config = this.sudokuService.gridConfig(gridSize);
      if (this.fragments.image) {
        const imageUrl = this.fragments.image.image;

        this.selectedFile = this.cryptoService.base64ToFile(
          this.fragments.image.image,
          this.fragments.image.imageName ?? 'sudoku-image.jpg'
        );
      }

      if (this.fragments.extractedGrid) {
        this.detectedBoard = this.sudokuService.cloneGrid(
          this.fragments.extractedGrid
        );
      }

    });

  }

  fragments!: SudokuFragments;

  config: SudokuConfig = {
    gridSize: 9,
    boxRows: 3,
    boxCols: 3
  };
  detectedBoard:any = [];
  loadingMessage = 'Processing image...';

  fragmentSubscription: any;

  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.loadFile(input.files[0]);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {

    event.preventDefault();

    if (!event.dataTransfer?.files.length) {
      return;
    }

    this.loadFile(event.dataTransfer.files[0]);
  }

  private loadFile(file: File): void {

    if (!file.type.startsWith('image/')) {
      alert('Please select an image.');
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    this.detectedBoard = [];
    reader.readAsDataURL(file);
  }

  removeImage(): void {

    this.selectedFile = null;
    this.previewUrl = null;
    this.detectedBoard = []

  }

  uploadImage(): void {

    const selectedFile = this.selectedFile;

    if (!selectedFile) {
      return;
    }
    if (this.detectedBoard.length !== 0) {
      this.router.navigate(['/review'], {
          fragment: this.cryptoService.encrypt({
            ...this.fragments
          })
        });
      return;
    }
    this.isUploading = true;

    const formData = new FormData();

    formData.append('image', selectedFile);
    formData.append('config', JSON.stringify(this.config));

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    this.sudokuService.upload(formData).subscribe(async (response) => {
      console.log(response, this.fragments);
      this.isUploading = false;
      if (response.success) {
        const base64Image = await this.cryptoService.fileToBase64(selectedFile);
        if (this.fragments && this.fragments.image) {
          delete this.fragments.image;
          delete this.fragments.extractedGrid;
        }
        this.router.navigate(['/review'], {
          fragment: this.cryptoService.encrypt({
            ...this.fragments, extractedGrid: response.grid, image: {
              image: base64Image,
              imageName: selectedFile.name,
              imageType: selectedFile.type
            }
          })
        });
      } else {
        alert(response.message);
      }
    });

  }

  ngOnDestroy(): void {
    this.fragmentSubscription.unsubscribe();
  }

}