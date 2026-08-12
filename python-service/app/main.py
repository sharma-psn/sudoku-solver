from fastapi import FastAPI

from app.routes.sudoku import router as sudoku_router

app = FastAPI(
    title="Sudoku OCR API",
    version="1.0.0",
)

app.include_router(sudoku_router)


@app.get("/")
def health():
    return {
        "status": "running",
        "service": "Sudoku OCR API",
    }