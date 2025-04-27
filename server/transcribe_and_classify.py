#!/usr/bin/env python
import sys
import os
import json

SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__)) 
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

import joblib
import librosa
import torch
from transformers import WhisperProcessor, WhisperForConditionalGeneration
from preprocessing.text_cleaner import TextCleaner


def respond(obj):
    print(json.dumps(obj))

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
dtype  = torch.float32 

MODEL_ID  = "openai/whisper-small"
processor = WhisperProcessor.from_pretrained(MODEL_ID)
whisper   = WhisperForConditionalGeneration.from_pretrained(MODEL_ID)
whisper.to(device)

def transcribe_audio(path: str, language: str = None) -> str:
    if not path.lower().endswith(".mp3"):
        raise ValueError("Only .mp3 files are supported")

    waveform_np, sr = librosa.load(path, sr=16000, mono=True)

    inputs = processor(
        waveform_np,
        sampling_rate=16000,
        return_tensors="pt"
    )

    inputs.input_features = inputs.input_features.to(device, dtype)

    gen_args = {}
    if language:
        gen_args["forced_decoder_ids"] = processor.get_decoder_prompt_ids(
            language=language, task="transcribe"
        )

    with torch.no_grad():
        predicted_ids = whisper.generate(inputs.input_features, **gen_args)

    transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
    return transcription

CLS_MODEL_PATH = os.path.join(SCRIPT_DIR, "models", "model.pkl")
VEC_PATH       = os.path.join(SCRIPT_DIR, "models", "vectorizer.pkl")

classifier = joblib.load(CLS_MODEL_PATH)
vectorizer = joblib.load(VEC_PATH)
cleaner    = TextCleaner()


def main():
    if len(sys.argv) < 2:
        respond({ "error": "No audio file path provided." })
        sys.exit(0)
    audio_path = sys.argv[1]
    if not os.path.isfile(audio_path):
        respond({ "error": f"File not found: {audio_path}" })
        sys.exit(0)

    try:
        text = transcribe_audio(audio_path, language='english')
        cleaned = cleaner.clean_text(text)
        vec = vectorizer.transform([cleaned])
        pred = classifier.predict(vec)[0]

        if hasattr(classifier, "predict_proba"):
            probs = classifier.predict_proba(vec)[0]
            idx   = list(classifier.classes_).index(pred)
            confidence = float(probs[idx])
        else:
            confidence = 1.0

        respond({
            "transcription": text,
            "prediction": pred,
            "confidence": confidence
        })

    except Exception as e:
        respond({ "error": str(e) })

    sys.exit(0)


if __name__ == "__main__":
    main()
