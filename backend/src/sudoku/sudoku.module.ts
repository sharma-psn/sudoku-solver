import { Module } from '@nestjs/common';
import { SudokuController } from './sudoku.controller';
import { SudokuService } from './sudoku.service';
import { PythonModule } from '../python-ocr/python.module';

@Module({
  imports: [PythonModule],
  controllers: [SudokuController],
  providers: [
    SudokuService
  ]
})
export class SudokuModule {}
