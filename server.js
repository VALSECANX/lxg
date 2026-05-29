const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const customerId = req.body.customerId || 'unknown_' + Date.now();
    const dir = path.join(uploadDir, customerId);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "Dosya yok" });

  console.log(`✅ Veri geldi → ${req.body.customerId || 'Bilinmiyor'}`);
  
  res.json({ 
    success: true, 
    message: "Veriler alındı", 
    filename: req.file.filename 
  });
});

app.get('/files', (req, res) => {
  const folders = fs.readdirSync(uploadDir);
  res.json(folders.map(folder => ({
    customerId: folder,
    files: fs.readdirSync(path.join(uploadDir, folder))
  })));
});

app.get('/', (req, res) => res.send('✅ Veri Kurtarma Backend Çalışıyor'));

app.listen(PORT, () => console.log(`🚀 Sunucu ${PORT} portunda`));
