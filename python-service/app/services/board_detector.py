import cv2
import numpy as np


class BoardDetector:
    """
    Detects the Sudoku board in an image.
    """

    def detect(self, image_bytes: bytes):
        """
        Detect the largest quadrilateral in the image.

        Args:
            image_bytes: Uploaded image bytes.

        Returns:
            tuple:
                original_image (numpy.ndarray)
                board_contour (numpy.ndarray)

        Raises:
            ValueError if no Sudoku board is found.
        """

        # Decode image bytes
        image_array = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

        if image is None:
            raise ValueError("Unable to decode image.")

        original = image.copy()

        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Reduce noise
        blurred = cv2.GaussianBlur(gray, (7, 7), 0)

        # Adaptive threshold
        thresh = cv2.adaptiveThreshold(
            blurred,
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            11,
            2,
        )

        # Invert colors
        thresh = cv2.bitwise_not(thresh)

        # Find contours
        contours, _ = cv2.findContours(
            thresh,
            cv2.RETR_EXTERNAL,
            cv2.CHAIN_APPROX_SIMPLE,
        )

        if not contours:
            raise ValueError("No contours found.")

        # Sort contours by area (largest first)
        contours = sorted(contours, key=cv2.contourArea, reverse=True)

        board_contour = None

        # Find largest quadrilateral
        for contour in contours:

            perimeter = cv2.arcLength(contour, True)

            approx = cv2.approxPolyDP(
                contour,
                0.02 * perimeter,
                True,
            )

            if len(approx) == 4:
                board_contour = approx
                break

        if board_contour is None:
            raise ValueError("Sudoku board not detected.")

        return original, board_contour