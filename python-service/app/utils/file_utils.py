from pathlib import Path
from fastapi import UploadFile


def get_extension(filename: str) -> str:
    """
    Returns file extension in lowercase.
    """
    return Path(filename).suffix.lower()


def validate_extension(filename: str, allowed_extensions: set[str]) -> bool:
    """
    Validate file extension.
    """
    extension = get_extension(filename)
    return extension in allowed_extensions


def validate_content_type(
    upload_file: UploadFile,
    allowed_types: set[str],
) -> bool:
    """
    Validate MIME type.
    """
    if upload_file.content_type is None:
        return False

    return upload_file.content_type.lower() in allowed_types


async def read_file(upload_file: UploadFile) -> bytes:
    """
    Read uploaded file bytes.
    """
    return await upload_file.read()


def ensure_directory(directory: str) -> Path:
    """
    Create directory if it does not exist.
    """
    path = Path(directory)
    path.mkdir(parents=True, exist_ok=True)
    return path