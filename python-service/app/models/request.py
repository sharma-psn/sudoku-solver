from pydantic import BaseModel, Field


class GridRequest(BaseModel):
    rows: int = Field(
        gt=0,
        description="Number of rows in a Sudoku box."
    )

    columns: int = Field(
        gt=0,
        description="Number of columns in a Sudoku box."
    )

    class Config:
        json_schema_extra = {
            "example": {
                "rows": 3,
                "columns": 3
            }
        }