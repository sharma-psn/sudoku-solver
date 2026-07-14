import { Body, Controller, Post } from '@nestjs/common';
import { SudokuService } from './sudoku.service';

@Controller('sudoku')
export class SudokuController {
    constructor(private readonly sudokuService: SudokuService) {}

  @Post('solve')
  solve(@Body() body: any) {
    const result = this.sudokuService.solveSudoku(body.grid);
    return {
      message: 'Received successfully',
      grid: result,
    };
  }
}