#!/usr/bin/env python
import sys
import os
import json
import joblib

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
sys.path.insert(0, PROJECT_ROOT)

from preprocessing.text_cleaner import TextCleaner

def respond(obj):
    print(json.dumps(obj))

MODEL_PATH = os.path.join(SCRIPT_DIR, 'models', 'model.pkl')
VECTORIZER_PATH = os.path.join(SCRIPT_DIR, 'models', 'vectorizer.pkl')

try:
    if len(sys.argv) < 2 or not sys.argv[1]:
        respond({"error": "No input text provided."})
    else:
        input_text = sys.argv[1]
        model = joblib.load(MODEL_PATH)
        vectorizer = joblib.load(VECTORIZER_PATH)
        cleaner = TextCleaner()
        cleaned_text = cleaner.clean_text(input_text)
        text_vector = vectorizer.transform([cleaned_text])
        prediction = model.predict(text_vector)
        respond({
            "prediction": prediction[0],
            "confidence": 1.0
        })
except Exception as e:
    respond({"error": str(e)})

sys.exit(0)
