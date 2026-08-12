import cv2
import numpy as np
import pytesseract
import time


class OCRService:
    """
    Performs OCR on extracted Sudoku cells.
    """

    def extract_grid(
        self,
        cells: list[np.ndarray],
        rows: int,
        cols: int,
    ) -> list[list[int]]:

        start = time.perf_counter()

        values = []

        config = (
            "--psm 10 "
            "--oem 3 "
            "-c tessedit_char_whitelist=123456789"
        )

        for index, cell in enumerate(cells):

            # First determine whether the cell actually contains
            # a digit before running OCR.
            if self._is_empty(cell):
                values.append(0)
                continue

            processed = self._preprocess(cell)

            text = pytesseract.image_to_string(
                processed,
                config=config,
            ).strip()

            # Tesseract may occasionally return multiple characters.
            # Sudoku cells should contain only one digit.
            if len(text) == 1 and text in "123456789":
                values.append(int(text))
            else:
                values.append(0)

        elapsed = time.perf_counter() - start

        print(
            f"OCR processed {len(cells)} cells "
            f"in {elapsed:.2f}s"
        )

        grid = []

        index = 0

        for _ in range(rows):

            row = []

            for _ in range(cols):
                row.append(values[index])
                index += 1

            grid.append(row)

        return grid

    def _is_empty(self, cell: np.ndarray) -> bool:
        """
        Quickly determine whether a Sudoku cell contains
        a visible digit.
        """

        # Convert to grayscale if necessary
        if len(cell.shape) == 3:
            gray = cv2.cvtColor(
                cell,
                cv2.COLOR_BGR2GRAY,
            )
        else:
            gray = cell

        # Threshold the cell
        _, thresh = cv2.threshold(
            gray,
            0,
            255,
            cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU,
        )

        # Ignore the outer border of the cell.
        # This prevents grid lines from being detected as digits.
        h, w = thresh.shape

        margin_x = int(w * 0.15)
        margin_y = int(h * 0.15)

        inner = thresh[
            margin_y:h - margin_y,
            margin_x:w - margin_x,
        ]

        # Count foreground pixels.
        foreground_pixels = cv2.countNonZero(inner)

        total_pixels = inner.shape[0] * inner.shape[1]

        ratio = foreground_pixels / total_pixels

        # Empty cells normally have very few foreground pixels.
        #
        # This threshold may need adjustment depending on
        # your cell extraction/preprocessing.
        return ratio < 0.02

    def _preprocess(self, cell: np.ndarray) -> np.ndarray:
        """
        Prepare a cell image for OCR.
        """

        if len(cell.shape) == 3:
            cell = cv2.cvtColor(
                cell,
                cv2.COLOR_BGR2GRAY,
            )

        # Binary threshold
        _, thresh = cv2.threshold(
            cell,
            0,
            255,
            cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU,
        )

        # Remove small noise
        kernel = np.ones((2, 2), np.uint8)

        thresh = cv2.morphologyEx(
            thresh,
            cv2.MORPH_OPEN,
            kernel,
        )

        # Make digits larger
        thresh = cv2.resize(
            thresh,
            None,
            fx=3,
            fy=3,
            interpolation=cv2.INTER_LINEAR,
        )

        return thresh