interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

export const translations: Translations = {
  ru: {
    title: 'Анализ киберэкстремизма',
    about: 'Этот сайт помогает выявлять и анализировать проявления киберэкстремизма в социальных сетях и мессенджерах с помощью обученной модели искусственного интеллекта. Просто загрузите файл или вставьте ссылку, выберите язык — и система сделает всё остальное.',
    chooseLanguage: 'Язык',
    uploadMedia: 'Загрузите фото, видео или аудио',
    pasteText: 'Вставьте текст из социальной сети',
    selectLanguage: 'Выберите язык',
    analyze: 'Анализировать',
    dragAndDrop: 'Перетащите файлы сюда или кликните для выбора',
    enterLink: 'Введите ссылку на контент из социальной сети',
    uploadButton: 'Загрузить файл',
    analyzeButton: 'Анализировать',
    results: 'Результаты анализа',
    confidence: 'Уверенность',
    details: 'Детали',
    recommendations: 'Рекомендации',
    backToHome: 'На главную',
    loading: 'Загрузка...',
    errorTitle: 'Ошибка',
    errorMessage: 'Произошла ошибка при анализе. Пожалуйста, попробуйте еще раз.',
    fileTooBig: 'Файл слишком большой. Максимальный размер: 50MB',
    invalidFileType: 'Неподдерживаемый тип файла',
    invalidLink: 'Некорректная ссылка',
    step1: 'Шаг 1',
    step2: 'Шаг 2',
    step3: 'Шаг 3'
  },
  en: {
    title: 'Cyberextremism Analysis',
    about: 'This website helps detect and analyze signs of cyber extremism in social networks and messengers using a trained artificial intelligence model. Simply upload a file or paste a link, choose your language — and the system will take care of the rest.',
    chooseLanguage: 'Choose language',
    uploadMedia: 'Upload photo, video, or audio',
    pasteText: 'Paste the social media text',
    selectLanguage: 'Select language',
    analyze: 'Analyze',
    dragAndDrop: 'Drag and drop files here or click to select',
    enterLink: 'Enter link to social media content',
    uploadButton: 'Upload file',
    analyzeButton: 'Analyze',
    results: 'Analysis Results',
    confidence: 'Confidence',
    details: 'Details',
    recommendations: 'Recommendations',
    backToHome: 'Back to Home',
    loading: 'Loading...',
    errorTitle: 'Error',
    errorMessage: 'An error occurred during analysis. Please try again.',
    fileTooBig: 'File is too large. Maximum size: 50MB',
    invalidFileType: 'Unsupported file type',
    invalidLink: 'Invalid link',
    step1: 'Step 1',
    step2: 'Step 2',
    step3: 'Step 3'
  },
  kz: {
    title: 'Киберэкстремизмді талдау',
    about: 'Бұл сайт әлеуметтік желілер мен мессенджерлердегі киберэкстремизм белгілерін жасанды интеллекттің оқытылған моделі арқылы анықтап, талдауға көмектеседі. Файлды жүктеңіз немесе сілтемені қойыңыз, тілді таңдаңыз — қалғанын жүйе өзі орындайды.',
    chooseLanguage: 'Тілді таңдаңыз',
    uploadMedia: 'Фото, бейне немесе аудио жүктеңіз',
    pasteText: 'Әлеуметтік желіден мәтінді қойыңыз',
    selectLanguage: 'Тілді таңдаңыз',
    analyze: 'Талдау',
    dragAndDrop: 'Файлдарды осында сүйреп апарыңыз немесе таңдау үшін басыңыз',
    enterLink: 'Әлеуметтік медиа мазмұнына сілтеме енгізіңіз',
    uploadButton: 'Файлды жүктеу',
    analyzeButton: 'Талдау',
    results: 'Талдау нәтижелері',
    confidence: 'Сенімділік',
    details: 'Егжей-тегжей',
    recommendations: 'Ұсыныстар',
    backToHome: 'Басты бетке',
    loading: 'Жүктелуде...',
    errorTitle: 'Қате',
    errorMessage: 'Талдау кезінде қате орын алды. Қайталап көріңіз.',
    fileTooBig: 'Файл тым үлкен. Максималды өлшемі: 50MB',
    invalidFileType: 'Қолдау көрсетілмейтін файл түрі',
    invalidLink: 'Жарамсыз сілтеме',
    step1: '1-қадам',
    step2: '2-қадам',
    step3: '3-қадам'
  }
};

export const getTranslation = (lang: string, key: string): string => {
  if (!translations[lang] || !translations[lang][key]) {

    return translations.ru[key] || key;
  }
  return translations[lang][key];
};