import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PYTHON = process.platform === 'win32'
  ? path.resolve(__dirname, '..', '.venv', 'Scripts', 'python.exe')
  : 'python3';

const app = express();
const port = 8000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tmpDir = join(__dirname, 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = {
      'image/png': true,
      'image/jpeg': true,
      'audio/mpeg': true,
      'video/mp4': true,
    };
    if (allowedTypes[file.mimetype]) cb(null, true);
    else cb(new Error('Invalid file type. Only PNG, JPG, MP3, and MP4 files are allowed.'));
  },
});

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

const analyzeContent = async (content, language) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const responses = {
    ru: {
      result: 'Экстремистский контент не обнаружен',
      confidence: 0.89,
      details: 'Проанализированный контент не содержит экстремистских материалов согласно российским стандартам классификации.',
      recommendations: [
        'Продолжайте мониторинг возможных изменений контента',
        'Просмотрите связанный контент, если доступен',
        'Рассмотрите возможность периодического повторного анализа'
      ]
    },
    en: {
      result: 'No extremist content detected',
      confidence: 0.92,
      details: 'The analyzed content does not contain extremist materials according to international classification standards.',
      recommendations: [
        'Continue monitoring for potential changes in content',
        'Review related content if available',
        'Consider periodic re-analysis as content may be updated'
      ]
    },
    kz: {
      result: 'Экстремистік мазмұн табылған жоқ',
      confidence: 0.87,
      details: 'Талданған мазмұнда Қазақстан Республикасының жіктелу стандарттарына сәйкес экстремистік материалдар жоқ.',
      recommendations: [
        'Мазмұнның ықтимал өзгерістерін бақылауды жалғастырыңыз',
        'Қол жетімді болса, қатысты мазмұнды қарап шығыңыз',
        'Мазмұн жаңартылуы мүмкін болғандықтан, мерзімді түрде қайта талдауды қарастырыңыз'
      ]
    }
  };

  return responses[language] || responses.en;
};

app.post('/api/analyze/text/:lang', async (req, res) => {
  try {
    const { text } = req.body;
    const { lang } = req.params;
    if (!text) return res.status(400).json({ error: 'No text provided' });

    const result = await analyzeContent(text, lang);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error analyzing text' });
  }
});

app.post('/api/analyze/file/:lang', upload.single('file'), async (req, res) => {
  try {
    const { lang } = req.params;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const result = await analyzeContent(req.file.path, lang);
    fs.unlink(req.file.path, err => err && console.error('Error deleting temp file:', err));

    res.json(result);
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, err => err && console.error('Error deleting temp file:', err));
    res.status(500).json({ error: 'Error analyzing file' });
  }
});

app.post('/api/extract-text', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const filePath = req.file.path;
  exec(`python3 server/image_to_text.py ${filePath}`, (error, stdout, stderr) => {
    fs.unlink(filePath, err => err && console.error('Error deleting temp file:', err));

    if (error) {
      return res.status(500).json({ error: 'Failed to extract text from image' });
    }

    return res.json({ extractedText: stdout.trim() });
  });
});

app.post('/api/transcribe-classify', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const filePath = req.file.path;
  const cmd = `"${PYTHON}" -u server/transcribe_and_classify.py "${filePath}"`;

  exec(
    cmd,
    { maxBuffer: 1024 * 1024 },
    (error, stdout, stderr) => {
      const match = stdout.match(/\{[\s\S]*\}/m);
      if (!match) {
        return res.status(500).json({ error: 'No JSON payload from transcribe_and_classify' });
      }

      let payload;
      try {
        payload = JSON.parse(match[0]);
      } catch (e) {
        return res.status(500).json({ error: 'Invalid JSON payload from transcribe_and_classify' });
      }

      if (payload.error) {
        return res.status(500).json({ error: payload.error });
      }

      return res.json(payload);
    }
  );
});

app.post('/api/transcribe-classify-video', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const videoPath = req.file.path;
  const cmd = `"${PYTHON}" -u server/transcribe_and_classify_video.py "${videoPath}"`;

  exec(cmd, { maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
    if (err) {
      const msg = stderr.trim() || err.message;
      return res.status(500).json({ error: msg });
    }

    const m = stdout.match(/\{[\s\S]*\}/m);
    if (!m) {
      return res.status(500).json({ error: 'No JSON from video script' });
    }

    let payload;
    try {
      payload = JSON.parse(m[0]);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Invalid JSON from video script' });
    }

    if (payload.error) {
      return res.status(500).json({ error: payload.error });
    }

    res.json(payload);
  });
});

app.post('/api/classify/en', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

  const safeText = JSON.stringify(text);
  const command  = `"${PYTHON}" -u server/classify_eng.py ${safeText}`;

  exec(
    command,
    { maxBuffer: 1024 * 500 },
    (error, stdout, stderr) => {
      const lines = stdout.trim().split(/\r?\n/);
      const last  = lines[lines.length - 1];

      let result;
      try {
        result = JSON.parse(last);
      } catch (parseError) {
        return res.status(500).json({ error: 'Invalid JSON from Python' });
      }

      if (result.error) {
        return res.status(500).json({ error: result.error });
      }

      return res.json(result);
    }
  );
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Max 20MB.' });
    }
    return res.status(400).json({ error: err.message });
  }

  if (err.message?.includes('Invalid file type')) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
