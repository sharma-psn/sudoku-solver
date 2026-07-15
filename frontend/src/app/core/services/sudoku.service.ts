import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from '../../../environments/environment';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SudokuService {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl + '/sudoku';

  solve(grid: number[][], config: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/solve`, { grid, config });
  }

}