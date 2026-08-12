import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SudokuService } from './sudoku.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('sudoku')
export class SudokuController {
  constructor(private readonly sudokuService: SudokuService) { }

  @Post('solve')
  solve(@Body() body: any) {
    const result = this.sudokuService.solveSudoku(body.grid, body.config);
    return result;
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('config') configString: string,
  ) {
    const config = JSON.parse(configString);
    console.log('Received file:', file);
    console.log(Buffer.isBuffer(file.buffer));
    console.log(file.buffer.constructor.name);
    return this.sudokuService.uploadSudoku(file, config);
  }
}
