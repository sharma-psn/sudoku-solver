import { Injectable } from '@nestjs/common';

export interface SudokuConfig {
  gridSize: number;
  boxRows: number;
  boxCols: number;
}

@Injectable()
export class SudokuService {

  solveSudoku(
    grid: number[][],
    config: SudokuConfig,
  ): number[][] | null {

    if (!this.isValidGrid(grid, config)) {
      return null;
    }

    const board = grid.map(row => [...row]);

    return this.solveGrid(board, config);
  }

  private solveGrid(
    grid: number[][],
    config: SudokuConfig,
  ): number[][] | null {

    const empty = this.findEmptyCell(grid, config);

    if (!empty) {
      return grid;
    }

    const [row, col] = empty;

    for (let num = 1; num <= config.gridSize; num++) {

      if (this.isSafeGrid(grid, row, col, num, config)) {

        grid[row][col] = num;

        const solved = this.solveGrid(grid, config);

        if (solved) {
          return solved;
        }

        grid[row][col] = 0;
      }
    }

    return null;
  }

  private findEmptyCell(
    grid: number[][],
    config: SudokuConfig,
  ): [number, number] | null {

    for (let row = 0; row < config.gridSize; row++) {

      for (let col = 0; col < config.gridSize; col++) {

        if (grid[row][col] === 0) {
          return [row, col];
        }

      }
    }

    return null;
  }

  private isSafeGrid(
    grid: number[][],
    row: number,
    col: number,
    num: number,
    config: SudokuConfig,
  ): boolean {

    // Row

    for (let c = 0; c < config.gridSize; c++) {

      if (grid[row][c] === num) {
        return false;
      }

    }

    // Column

    for (let r = 0; r < config.gridSize; r++) {

      if (grid[r][col] === num) {
        return false;
      }

    }

    // Box

    const startRow =
      Math.floor(row / config.boxRows) * config.boxRows;

    const startCol =
      Math.floor(col / config.boxCols) * config.boxCols;

    for (let r = startRow; r < startRow + config.boxRows; r++) {

      for (let c = startCol; c < startCol + config.boxCols; c++) {

        if (grid[r][c] === num) {
          return false;
        }

      }

    }

    return true;
  }

  private isValidGrid(
    grid: number[][],
    config: SudokuConfig,
  ): boolean {

    if (!Array.isArray(grid)) {
      return false;
    }

    if (grid.length !== config.gridSize) {
      return false;
    }

    for (const row of grid) {

      if (!Array.isArray(row) || row.length !== config.gridSize) {
        return false;
      }

      for (const value of row) {

        if (
          typeof value !== 'number' ||
          value < 0 ||
          value > config.gridSize
        ) {
          return false;
        }

      }

    }

    return (
      this.isValidRows(grid, config) &&
      this.isValidColumns(grid, config) &&
      this.isValidSubgrids(grid, config)
    );
  }

  private isValidRows(
    grid: number[][],
    config: SudokuConfig,
  ): boolean {

    for (let row = 0; row < config.gridSize; row++) {

      const seen = new Set<number>();

      for (let col = 0; col < config.gridSize; col++) {

        const value = grid[row][col];

        if (value !== 0) {

          if (seen.has(value)) {
            return false;
          }

          seen.add(value);
        }

      }

    }

    return true;
  }

  private isValidColumns(
    grid: number[][],
    config: SudokuConfig,
  ): boolean {

    for (let col = 0; col < config.gridSize; col++) {

      const seen = new Set<number>();

      for (let row = 0; row < config.gridSize; row++) {

        const value = grid[row][col];

        if (value !== 0) {

          if (seen.has(value)) {
            return false;
          }

          seen.add(value);
        }

      }

    }

    return true;
  }

  private isValidSubgrids(
    grid: number[][],
    config: SudokuConfig,
  ): boolean {

    for (
      let boxRow = 0;
      boxRow < config.gridSize;
      boxRow += config.boxRows
    ) {

      for (
        let boxCol = 0;
        boxCol < config.gridSize;
        boxCol += config.boxCols
      ) {

        const seen = new Set<number>();

        for (
          let row = boxRow;
          row < boxRow + config.boxRows;
          row++
        ) {

          for (
            let col = boxCol;
            col < boxCol + config.boxCols;
            col++
          ) {

            const value = grid[row][col];

            if (value !== 0) {

              if (seen.has(value)) {
                return false;
              }

              seen.add(value);
            }

          }

        }

      }

    }

    return true;
  }

}