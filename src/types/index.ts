export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  route: string;
}

export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes: string[];
  maxSize?: number;
}

export interface TextInputProps {
  onTextSubmit: (text: string) => void;
  placeholder: string;
}

export interface AnalysisResponse {
  result: string;
  confidence: number;
  details?: string;
  recommendations?: string[];
}