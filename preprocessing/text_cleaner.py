import re
import string
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

class TextCleaner:
    def __init__(self):
        self.stop_words = set(ENGLISH_STOP_WORDS)
        self.punctuation_table = str.maketrans('', '', string.punctuation)

    def clean_text(self, text):
        text = text.lower()
        text = text.translate(self.punctuation_table)
        words = text.split()
        cleaned_words = [word for word in words if word not in self.stop_words and word.isalpha()]

        return ' '.join(cleaned_words)
