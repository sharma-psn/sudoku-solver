from pathlib import Path

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

# Project Root
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env file
load_dotenv(BASE_DIR / ".env")


class Settings(BaseSettings):
    # ==========================
    # Application
    # ==========================
    APP_NAME: str = "Sudoku OCR API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # ==========================
    # Upload
    # ==========================
    UPLOAD_DIR: str = "temp/uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024

    # ==========================
    # Image Processing
    # ==========================
    BOARD_SIZE: int = 900
    CELL_SIZE: int = 100

    # ==========================
    # OCR
    # ==========================
    OCR_ENGINE: str = "easyocr"
    OCR_LANGUAGE: str = "en"
    OCR_CONFIDENCE_THRESHOLD: float = 0.5

    # ==========================
    # Logging
    # ==========================
    LOG_LEVEL: str = "INFO"

    # ==========================
    # CORS
    # ==========================
    ALLOWED_ORIGINS: str = "http://localhost:4200,http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()