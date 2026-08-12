import cv2
import numpy as np


class CellExtractor:
    """
    Splits a warped Sudoku board into individual cell images.
    """

    def extract(
        self,
        warped: np.ndarray,
        rows: int,
        cols: int,
    ) -> list[np.ndarray]:
        """
        Split the board into rows × cols cells.

        Args:
            warped: Perspective corrected Sudoku board.
            rows: Number of rows.
            cols: Number of columns.

        Returns:
            List of cropped cell images.
        """

        gray = cv2.cvtColor(warped, cv2.COLOR_BGR2GRAY)

        height, width = gray.shape

        cell_height = height // rows
        cell_width = width // cols

        cells = []

        for row in range(rows):
            for col in range(cols):

                y1 = row * cell_height
                y2 = (row + 1) * cell_height

                x1 = col * cell_width
                x2 = (col + 1) * cell_width

                cell = gray[y1:y2, x1:x2]

                # Remove borders so OCR doesn't see grid lines
                margin_y = int(cell.shape[0] * 0.12)
                margin_x = int(cell.shape[1] * 0.12)

                cell = cell[
                    margin_y:cell.shape[0] - margin_y,
                    margin_x:cell.shape[1] - margin_x,
                ]

                cells.append(cell)

        return cells