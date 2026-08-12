import cv2
import numpy as np


def decode_image(image_bytes: bytes) -> np.ndarray:
    """
    Decode uploaded image bytes into an OpenCV image.
    """
    image_array = np.frombuffer(image_bytes, dtype=np.uint8)

    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    if image is None:
        raise ValueError("Unable to decode image.")

    return image


def resize_image(
    image: np.ndarray,
    width: int = 900,
) -> np.ndarray:
    """
    Resize while maintaining aspect ratio.
    """
    height = int(image.shape[0] * width / image.shape[1])

    return cv2.resize(
        image,
        (width, height),
        interpolation=cv2.INTER_AREA,
    )


def to_grayscale(image: np.ndarray) -> np.ndarray:
    """
    Convert image to grayscale.
    """
    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)


def apply_gaussian_blur(image: np.ndarray) -> np.ndarray:
    """
    Reduce image noise.
    """
    return cv2.GaussianBlur(image, (5, 5), 0)


def adaptive_threshold(image: np.ndarray) -> np.ndarray:
    """
    Convert grayscale image to binary image.
    """
    return cv2.adaptiveThreshold(
        image,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        11,
        2,
    )


def save_image(path: str, image: np.ndarray) -> None:
    """
    Save image to disk.
    """
    cv2.imwrite(path, image)