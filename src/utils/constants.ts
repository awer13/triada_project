import { LanguageOption } from '../types';

export const LANGUAGES: LanguageOption[] = [
  
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    route: '/en_cyber'
  }
  
];

export const API_ENDPOINTS = {
  RUSSIAN: '/analyze/ru',
  ENGLISH: '/analyze/en',
  KAZAKH: '/analyze/kz',
};

export const ACCEPTED_FILE_TYPES = {
  IMAGE: 'image/*',
  AUDIO: 'audio/*',
  VIDEO: 'video/*'
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB