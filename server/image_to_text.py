import sys
from PIL import Image
import pytesseract

if len(sys.argv) < 2:
    print("Usage: python image_to_text.py <image_path>")
    sys.exit(1)

image_path = sys.argv[1]
lang = "eng+rus+kaz"
text = pytesseract.image_to_string(Image.open(image_path), lang=lang)
print(text)