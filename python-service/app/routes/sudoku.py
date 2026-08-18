from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.services.image_service import ImageService
from app.models.response import ExtractGridResponse

router = APIRouter(
    prefix="/sudoku",
    tags=["Sudoku"],
)

image_service = ImageService()


@router.post(
    "/extract-grid",
    response_model=ExtractGridResponse,
)
async def extract_grid(
    image: UploadFile = File(...),
    rows: int = Form(...),
    cols: int = Form(...),
):
    print("========== EXTRACT GRID CALLED ==========", flush=True)
    """
    Extract the Sudoku grid from an uploaded image.
    """

    try:
        grid = await image_service.extract_grid(
            image=image,
            rows=rows,
            cols=cols,
        )

        return ExtractGridResponse(
            success=True,
            message="Grid extracted successfully.",
            grid=grid,
            rows=rows,
            columns=cols,
        )

    except ValueError as exc:
        print("VALUE ERROR:", str(exc))
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception as exc:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {str(exc)}",
        )