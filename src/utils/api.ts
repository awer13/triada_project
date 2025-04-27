const API_BASE_URL = 'http://localhost:8000/api';

export const analyzeText = async (text: string, language: string) => {
  const response = await fetch(`${API_BASE_URL}/analyze/text/${language}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error analyzing text');
  }

  return await response.json();
};

export const analyzeFile = async (file: File, language: string) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/analyze/file/${language}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error analyzing file');
  }

  return await response.json();
};

export const extractTextFromImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/extract-text`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error extracting text from image');
  }

  return await response.json();
};

export const classifyEnglishText = async (text: string) => {
  const response = await fetch(`${API_BASE_URL}/classify/en`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error classifying text');
  }

  return await response.json();
};

export const transcribeAndClassify = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/transcribe-classify`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error in transcribeAndClassify');
  }

  return await res.json() as {
    transcription: string;
    prediction: string;
    confidence: number;
  };
};

export const transcribeAndClassifyVideo = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/transcribe-classify-video`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Error processing video');
  }

  return (await response.json()) as {
    transcription: string;
    prediction: string;
    confidence: number;
  };
};
