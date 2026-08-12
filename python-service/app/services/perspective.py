import cv2
import numpy as np


class PerspectiveTransformer:
    """
    Applies a perspective transform to obtain a top-down view
    of the detected Sudoku board.
    """

    def warp(self, image: np.ndarray, contour: np.ndarray) -> np.ndarray:
        """
        Warp the detected Sudoku board into a square image.

        Args:
            image: Original OpenCV image.
            contour: 4-point contour of the Sudoku board.

        Returns:
            Warped square image.
        """

        points = self._order_points(contour.reshape(4, 2))

        (tl, tr, br, bl) = points

        width_top = np.linalg.norm(tr - tl)
        width_bottom = np.linalg.norm(br - bl)
        max_width = int(max(width_top, width_bottom))

        height_left = np.linalg.norm(bl - tl)
        height_right = np.linalg.norm(br - tr)
        max_height = int(max(height_left, height_right))

        size = max(max_width, max_height)

        destination = np.array(
            [
                [0, 0],
                [size - 1, 0],
                [size - 1, size - 1],
                [0, size - 1],
            ],
            dtype="float32",
        )

        matrix = cv2.getPerspectiveTransform(
            points.astype("float32"),
            destination,
        )

        warped = cv2.warpPerspective(
            image,
            matrix,
            (size, size),
        )

        return warped

    def _order_points(self, points: np.ndarray) -> np.ndarray:
        """
        Order points as:
        top-left,
        top-right,
        bottom-right,
        bottom-left.
        """

        ordered = np.zeros((4, 2), dtype="float32")

        s = points.sum(axis=1)
        ordered[0] = points[np.argmin(s)]
        ordered[2] = points[np.argmax(s)]

        diff = np.diff(points, axis=1)
        ordered[1] = points[np.argmin(diff)]
        ordered[3] = points[np.argmax(diff)]

        return ordered