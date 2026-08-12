import { Injectable } from '@nestjs/common';
import { PythonService } from '../python-ocr/python.service';

export interface SudokuConfig {
    gridSize: number;
    boxRows: number;
    boxCols: number;
}

export interface SudokuValidationResult {
    isValid: boolean;
    message: string;
}

export interface SudokuSolveResponse {
    success: boolean;
    message: string;
    grid: number[][];
}


@Injectable()
export class SudokuService {

    constructor(
        private readonly pythonService: PythonService,
    ) { }


    async uploadSudoku(
        image: any,
        config: SudokuConfig,
    ): Promise<SudokuSolveResponse> {
        const returnResponse = {
            success: true,
            message: "Grid Solved successfully",
            grid: [[0]]
        }
        try {

            if (!image || !image.buffer || image.buffer.length === 0) {
                returnResponse.success = false;
                returnResponse.message = "Image is required.";
                return returnResponse;
            }
            if (config.gridSize <= 0 || config.boxRows <= 0 || config.boxCols <= 0) {
                returnResponse.success = false;
                returnResponse.message = "Invalid Sudoku configuration.";
                return returnResponse;
            }

            const data = await this.pythonService.extractGrid(image, config.boxRows, config.boxCols);
            if (!data.success) {
                throw Error(data.message);
            }
            const grid = data.grid
            const validCheck = this.isValidGrid(grid, config);
            if (!validCheck.isValid) {
                returnResponse.success = false;
                returnResponse.message = validCheck.message;
                return returnResponse;
            }
            returnResponse.grid = grid;
        } catch (error) {
            console.error("Error processing the image:", error);
            returnResponse.success = false;
            returnResponse.message = "Error processing the image: " + (error as Error).message;
            return returnResponse;
        }

        return returnResponse;
    }

    solveSudoku(
        grid: number[][],
        config: SudokuConfig,
    ): SudokuSolveResponse {

        const returnResponse = {
            success: true,
            message: "Grid Solved successfully",
            grid: [[0]]
        }
        if (config.gridSize <= 0 || config.boxRows <= 0 || config.boxCols <= 0) {
            returnResponse.success = false;
            returnResponse.message = "Invalid Sudoku configuration.";
            return returnResponse;
        }
        const validCheck = this.isValidGrid(grid, config);
        if (!validCheck.isValid) {
            returnResponse.success = false;
            returnResponse.message = validCheck.message;
            return returnResponse;
        }

        const board = grid.map(row => [...row]);

        const solvedBoard = this.solveGrid(board, config);

        if (!solvedBoard) {
            returnResponse.success = false;
            returnResponse.message = "Not a Valid Grid";
        } else {
            returnResponse.grid = solvedBoard;
        }

        return returnResponse;
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
    ): SudokuValidationResult {

        const validReturn: SudokuValidationResult = {
            isValid: true,
            message: "Grid is valid"
        }

        if (!Array.isArray(grid)) {
            validReturn.isValid = false;
            validReturn.message = "Not a Vaild Grid";
            return validReturn;
        }

        if (grid.length !== config.gridSize) {
            validReturn.isValid = false;
            validReturn.message = "Selected Size and Grid Size are not Same";
            return validReturn;
        }

        for (const row of grid) {

            if (!Array.isArray(row) || row.length !== config.gridSize) {
                validReturn.isValid = false;
                validReturn.message = "Not a Vaild Grid";
                return validReturn;
            }

            for (const value of row) {

                if (
                    typeof value !== 'number' ||
                    value < 0 ||
                    value > config.gridSize
                ) {
                    validReturn.isValid = false;
                    validReturn.message = "Grid doesn't has extra values";
                    return validReturn;
                }

            }

        }

        if (!this.isValidRows(grid, config)) {
            validReturn.isValid = false;
            validReturn.message = "Grid has duplicate values in same row";
            return validReturn;
        } else if (!this.isValidColumns(grid, config)) {
            validReturn.isValid = false;
            validReturn.message = "Grid has duplicate values in same cloumn";
            return validReturn;
        } else if (!this.isValidSubgrids(grid, config)) {
            validReturn.isValid = false;
            validReturn.message = "Grid has duplicate values in same sub grid";
            return validReturn;
        }

        return validReturn;
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