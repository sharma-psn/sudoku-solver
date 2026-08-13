import importlib.util
import re
import sys
from pathlib import Path

req_path = Path(r'D:\sudoku-solver\python-service\requirements.txt')
output_path = Path(r'D:\sudoku-solver\python-service\temp\requirements_check.txt')

mapping = {
    'fastapi': 'fastapi',
    'uvicorn': 'uvicorn',
    'python-multipart': 'multipart',
    'pydantic': 'pydantic',
    'opencv-python': 'cv2',
    'numpy': 'numpy',
    'Pillow': 'PIL',
    'easyocr': 'easyocr',
    'torch': 'torch',
    'torchvision': 'torchvision',
    'loguru': 'loguru',
    'python-dotenv': 'dotenv',
}

required = []
missing = []
for raw in req_path.read_text(encoding='utf-8').splitlines():
    line = raw.strip()
    if not line or line.startswith('#'):
        continue
    pkg = line.split('#', 1)[0].strip()
    if not pkg:
        continue
    name = re.split(r'[<>=!\[]', pkg, 1)[0].strip()
    mod = mapping.get(name, name)
    required.append((name, mod))
    if importlib.util.find_spec(mod) is None:
        missing.append((name, mod))

lines = []
lines.append(f'Python version: {sys.version.split()[0]}')
lines.append(f'Required packages: {len(required)}')
lines.append(f'Missing packages: {len(missing)}')
if missing:
    for name, mod in missing:
        lines.append(f'MISSING  {name} -> {mod}')
    lines.append('SOME REQUIRED PACKAGES ARE MISSING.')
else:
    for name, mod in required:
        lines.append(f'OK  {name} -> {mod}')
    lines.append('ALL REQUIRED PACKAGES ARE AVAILABLE.')

output_path.write_text('\n'.join(lines) + '\n', encoding='utf-8')
print('\n'.join(lines))
