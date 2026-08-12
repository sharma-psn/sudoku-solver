from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(
        default="healthy",
        description="Service health status."
    )

    service: str = Field(
        description="Service name."
    )

    version: str = Field(
        description="Application version."
    )


class ExtractGridResponse(BaseModel):
    success: bool = Field(
        description="Whether a matching Sudoku grid was found."
    )

    message: str = Field(
        description="Result message."
    )

    rows: int = Field(
        description="Requested number of rows."
    )

    columns: int = Field(
        description="Requested number of columns."
    )

    grid: list[list[int]] = Field(
        default_factory=list,
        description="Extracted Sudoku grid. Empty if no matching grid is found."
    )


class ErrorResponse(BaseModel):
    detail: str = Field(
        description="Error message."
    )