import React, { useState } from 'react';
import { getTranslation } from '../utils/translations';
import Header from '../components/Header';
import FileUpload from '../components/FileUpload';
import TextInput from '../components/TextInput';
import AnalysisResult from '../components/AnalysisResult';
import Loader from '../components/Loader';
import { ACCEPTED_FILE_TYPES } from '../utils/constants';
import { AnalysisResponse } from '../types';
import {
  classifyEnglishText,
  extractTextFromImage,
  transcribeAndClassify,
  transcribeAndClassifyVideo,
} from '../utils/api';

const EnglishCyber: React.FC = () => {
  const lang = 'en';
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [outputText, setOutputText] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setText(null);
    setOutputText(null);
    setResult(null);
    setError(null);
  };

  const handleTextSubmit = (submittedText: string) => {
    setText(submittedText);
    setFile(null);
    setOutputText(null);
    setResult(null);
    setError(null);
  };

  const handleExtractText = async () => {
    if (!file && !text) {
      setError('Please upload a file or enter text first');
      return;
    }
    setLoading(true);
    setError(null);
    setOutputText(null);
    try {
      if (file) {
        const { extractedText } = await extractTextFromImage(file);
        setOutputText(extractedText);
        if (!extractedText.trim()) {
          setError('No text was extracted from the image.');
        }
      } else if (text) {
        setOutputText(text);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error extracting text.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!outputText) {
      setError('Please extract text first before analyzing');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await classifyEnglishText(outputText);
      setResult({
        result: response.prediction,
        confidence: response.confidence ?? 1.0,
        details: 'Classified by the machine learning model.',
        recommendations: [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error during classification.');
    } finally {
      setLoading(false);
    }
  };

  const handleTranscribeAndClassify = async () => {
    if (!file) {
      setError('Please upload an audio file first');
      return;
    }
    setLoading(true);
    setError(null);
    setOutputText(null);
    try {
      const { transcription, prediction, confidence } =
        await transcribeAndClassify(file);
      setOutputText(transcription);
      setResult({
        result: prediction,
        confidence,
        details: 'Transcribed & classified by model',
        recommendations: [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error during transcription/classification.');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoTranscribe = async () => {
    if (!file) {
      setError('Please upload a video file first');
      return;
    }
    setLoading(true);
    setError(null);
    setOutputText(null);
    try {
      const { transcription, prediction, confidence } =
        await transcribeAndClassifyVideo(file);
      setOutputText(transcription);
      setResult({
        result: prediction,
        confidence,
        details: 'Transcribed & classified from video',
        recommendations: [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error during video transcription/classification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen dark-gradient pb-16">
      <div className="container mx-auto px-4 py-12">
        <Header title={getTranslation(lang, 'title')} showBackButton />

        <div className="max-w-3xl mx-auto">
          {!loading && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6 text-glow">
                  {getTranslation(lang, 'uploadMedia')}
                </h2>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  acceptedFileTypes={[
                    ACCEPTED_FILE_TYPES.IMAGE,
                    ACCEPTED_FILE_TYPES.AUDIO,
                    ACCEPTED_FILE_TYPES.VIDEO,
                  ]}
                />
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6 text-glow">
                  Enter text for analysis
                </h2>
                <TextInput
                  onTextSubmit={handleTextSubmit}
                  placeholder="Enter or paste text to analyze..."
                />
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
                  {error}
                </div>
              )}

              <div className="flex justify-center mb-6 gap-4">
                {file && file.type.startsWith('audio/') ? (
                  <button
                    onClick={handleTranscribeAndClassify}
                    className="btn btn-primary px-8"
                    disabled={loading}
                  >
                    Transcribe & Classify Audio
                  </button>
                ) : file && file.type === 'video/mp4' ? (
                  <button
                    onClick={handleVideoTranscribe}
                    className="btn btn-primary px-8"
                    disabled={loading}
                  >
                    Transcribe & Classify Video
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleExtractText}
                      className="btn btn-secondary px-8"
                      disabled={loading}
                    >
                      Extract Text
                    </button>
                    <button
                      onClick={handleAnalyze}
                      className="btn btn-primary px-8"
                      disabled={!outputText || loading}
                    >
                      Analyze
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {loading && <Loader />}

          {outputText && !loading && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-glow">
                {file && file.type.startsWith('audio/')
                  ? 'Transcription'
                  : file && file.type === 'video/mp4'
                  ? 'Transcription'
                  : 'Output Text'}
              </h2>
              <div className="bg-slate-800 p-4 rounded text-slate-300 whitespace-pre-wrap">
                {outputText}
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6 text-glow">
                {getTranslation(lang, 'results')}
              </h2>
              <AnalysisResult result={result} language={lang} />

              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    setFile(null);
                    setText(null);
                    setOutputText(null);
                    setResult(null);
                    setError(null);
                  }}
                  className="btn btn-secondary"
                >
                  Analyze Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnglishCyber;
