import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
// import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SudokuService {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl + '/sudoku';

  gridConfig(gridSize: number): { gridSize: number; boxRows: number; boxCols: number } {
    let boxRows: number = 0;
    let boxCols: number = 0;
    if (Number.isInteger(Math.sqrt(gridSize))) {
        boxRows = Math.sqrt(gridSize);
        boxCols = Math.sqrt(gridSize);
      } else {
        for (let i = Math.floor(Math.sqrt(gridSize)); i >= 2; i--) {
          if (gridSize % i === 0) {
            boxRows = i;
            boxCols = gridSize / i;
            break;
          }
        }
      }
    return { gridSize, boxRows, boxCols };
  }

  cloneGrid(
    grid: number[][]
  ): number[][] {
    return grid.map(row => [...row]);
  }

  solve(grid: number[][], config: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/solve`, { grid, config });
  }

  upload(image: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/upload`, image);
  }

}