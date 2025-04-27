import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { FileUploadProps } from '../types';
import { MAX_FILE_SIZE } from '../utils/constants';

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedFileTypes,
  maxSize = MAX_FILE_SIZE,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      
      if (acceptedFiles.length === 0) {
        return;
      }
      
      const file = acceptedFiles[0];
      
      if (file.size > maxSize) {
        setError(`File is too large. Maximum size: ${Math.floor(maxSize / (1024 * 1024))}MB`);
        return;
      }
      
      setSelectedFile(file);
      onFileSelect(file);
    },
    [maxSize, onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    multiple: false,
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="mb-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-slate-600 hover:border-blue-400 hover:bg-slate-800/50'
        } ${error ? 'border-red-500' : ''}`}
      >
        <input {...getInputProps()} />
        
        {selectedFile ? (
          <div className="flex items-center justify-between bg-slate-700 p-3 rounded">
            <div className="flex items-center">
              <File className="text-blue-400 mr-3" size={24} />
              <div className="text-left">
                <p className="font-medium text-slate-100">{selectedFile.name}</p>
                <p className="text-sm text-slate-400">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button 
              onClick={removeFile}
              className="p-1 rounded-full hover:bg-slate-600 transition-colors"
            >
              <X size={20} className="text-slate-400 hover:text-red-400" />
            </button>
          </div>
        ) : (
          <div className="py-8">
            <Upload className="mx-auto text-blue-400 mb-4" size={40} />
            <p className="text-lg font-medium mb-2">
              {isDragActive
                ? 'Drop the file here...'
                : 'Drag and drop a file here, or click to select'}
            </p>
            <p className="text-sm text-slate-400">
              Supported formats: images, videos, audio • Max size: {Math.floor(maxSize / (1024 * 1024))}MB
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-2 text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;