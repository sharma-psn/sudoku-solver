import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SudokuModule } from './sudoku/sudoku.module';
import { ConfigModule } from '@nestjs/config';
import { PythonModule } from './python-ocr/python.module';

@Module({
  imports: [SudokuModule,ConfigModule.forRoot({isGlobal: true}), PythonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
