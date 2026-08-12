# Allowed image MIME types
ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
}

# Allowed file extensions
ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}

# Sudoku Constants
GRID_SIZE = 9
TOTAL_CELLS = 81

# Image Processing
DEFAULT_BOARD_SIZE = 900
DEFAULT_CELL_SIZE = 100

# OpenCV
THRESHOLD_BLOCK_SIZE = 11
THRESHOLD_C = 2
GAUSSIAN_KERNEL = (5, 5)

# OCR
EMPTY_CELL = 0
MIN_CONFIDENCE = 0.5