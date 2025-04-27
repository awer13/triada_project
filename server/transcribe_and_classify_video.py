#!/usr/bin/env python
import sys
import os
import json
import joblib
import librosa
import torch
from transformers import WhisperProcessor, WhisperForConditionalGeneration

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
sys.path.insert(0, PROJECT_ROOT)

from preprocessing.text_cleaner import TextCleaner

def respond(obj):
    print(json.dumps(obj))

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
dtype = torch.float32
MODEL_ID = "openai/whisper-small"
processor = WhisperProcessor.from_pretrained(MODEL_ID)
whisper = WhisperForConditionalGeneration.from_pretrained(MODEL_ID).to(device)

declare_model = os.path.join(SCRIPT_DIR, "models", "model.pkl")
declare_vector = os.path.join(SCRIPT_DIR, "models", "vectorizer.pkl")
classifier = joblib.load(declare_model)
vectorizer = joblib.load(declare_vector)
cleaner = TextCleaner()

def transcribe_audio(path: str) -> str:
    waveform, sr = librosa.load(path, sr=16000, mono=True)
    inputs = processor(waveform, sampling_rate=16000, return_tensors="pt")
    inputs.input_features = inputs.input_features.to(device, dtype)
    with torch.no_grad():
        predicted_ids = whisper.generate(inputs.input_features)
    return processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]

def main():
    if len(sys.argv) < 2:
        respond({"error": "No file path provided."})
        sys.exit(0)
    src = sys.argv[1]
    if not os.path.isfile(src) or not (src.lower().endswith(".mp4") or src.lower().endswith(".wav")):
        respond({"error": f"File not found or unsupported format: {src}"})
        sys.exit(0)
    try:
        transcription = transcribe_audio(src)
        cleaned = cleaner.clean_text(transcription)
        vec = vectorizer.transform([cleaned])
        pred = classifier.predict(vec)[0]
        if hasattr(classifier, "predict_proba"):
            probs = classifier.predict_proba(vec)[0]
            idx = list(classifier.classes_).index(pred)
            confidence = float(probs[idx])
        else:
            confidence = 1.0
        respond({
            "transcription": transcription,
            "prediction": pred,
            "confidence": confidence
        })
    except Exception as e:
        respond({"error": str(e)})
    sys.exit(0)

if __name__ == "__main__":
    main()
