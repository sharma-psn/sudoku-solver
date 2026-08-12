from fastapi import UploadFile

from app.services.board_detector import BoardDetector
from app.services.perspective import PerspectiveTransformer
from app.services.cell_extractor import CellExtractor
from app.services.ocr import OCRService


class ImageService:

    def __init__(self):
        self.board_detector = BoardDetector()
        self.perspective = PerspectiveTransformer()
        self.cell_extractor = CellExtractor()
        self.ocr = OCRService()

    async def extract_grid(
        self,
        image: UploadFile,
        rows: int,
        cols: int,
    ) -> list[list[int]]:

        image_bytes = await image.read()

        original, contour = self.board_detector.detect(image_bytes)

        warped = self.perspective.warp(original, contour)

        grid_rows = rows * rows
        grid_cols = cols * cols

        cells = self.cell_extractor.extract(
            warped,
            grid_rows,
            grid_cols,
        )

        grid = self.ocr.extract_grid(
            cells,
            grid_rows,
            grid_cols,
        )

        return grid