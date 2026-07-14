import { Injectable } from '@nestjs/common';

@Injectable()
export class SudokuService {

    solveSudoku(grid: number[][]): number[][] | null {
        if (!this.isValidGrid(grid)) {
            return null;
        }
        const boardCopy = grid.map(row => [...row]);
        return this.solveGrid(boardCopy);
    }

    solveGrid(grid: number[][]): number[][] | null {
        const emptyCell = this.findEmptyCell(grid);
        if (!emptyCell) {
            return grid;
        }
        const [row, col] = emptyCell;
        for (let num = 1; num <= 9; num++) {
            if (this.isSafeGrid(grid, row, col, num)) {
                grid[row][col] = num;
                const result = this.solveGrid(grid);
                if (result) {
                    return result;
                }
                grid[row][col] = 0;
            }
        }
        return null;
    }

    isValidGrid(grid: number[][]): boolean {
        if (!Array.isArray(grid) || grid.length !== 9) {
            return false;
        }
        for (let i = 0; i < 9; i++) {
            if (grid[i].length !== 9) {
                return false;
            }
            for (let j = 0; j < 9; j++) {
                if (typeof grid[i][j] !== 'number' || grid[i][j] < 0 || grid[i][j] > 9) {
                    return false;
                }
            }
        }
        return (this.isValidRows(grid) && this.isValidColumns(grid) && this.isValidSubgrids(grid));
    }

    isValidRows(grid: number[][]): boolean {
        for (let i = 0; i < 9; i++) {
            const seen = new Set<number>();
            for (let j = 0; j < 9; j++) {
                const num = grid[i][j];
                if (num !== 0) {
                    if (seen.has(num)) {
                        return false;
                    }
                    seen.add(num);
                }
            }
        }
        return true;
    }

    isValidColumns(grid: number[][]): boolean {
        for (let j = 0; j < 9; j++) {
            const seen = new Set<number>();
            for (let i = 0; i < 9; i++) {
                const num = grid[i][j];
                if (num !== 0) {
                    if (seen.has(num)) {
                        return false;
                    }
                    seen.add(num);
                }
            }
        }
        return true;
    }

    isValidSubgrids(grid: number[][]): boolean {
        for (let row = 0; row < 9; row += 3) {
            for (let col = 0; col < 9; col += 3) {
                const seen = new Set<number>();
                for (let i = row; i < row + 3; i++) {
                    for (let j = col; j < col + 3; j++) {
                        const num = grid[i][j];
                        if (num !== 0) {
                            if (seen.has(num)) {
                                return false;
                            }
                            seen.add(num);
                        }
                    }
                }
            }
        }
        return true;
    }

    isSafeGrid(grid: number[][], row: number, col: number, num: number): boolean {
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num || grid[x][col] === num) {
                return false;
            }
        }
        const startRow = row - row % 3;
        const startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[i + startRow][j + startCol] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    findEmptyCell(grid: number[][]): [number, number] | null {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (grid[i][j] === 0) {
                    return [i, j];
                }
            }
        }
        return null;
    }
}
