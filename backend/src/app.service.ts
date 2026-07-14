import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  sudokuApp(): string {
    return 'Sudoku App Running Successfully!';
  }
}
