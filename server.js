const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// APK Linki için (şu an placeholder)
app.get('/apk/:customerId.apk', (req, res) => {
  const customerId = req.params.customerId;
  res.send(`
    <h2>APK İndirme Sayfası</h2>
    <p>Müşteri ID: <strong>${customerId}</strong></p>
    <p>Bu kısım daha sonra gerçek APK ile değiştirilecek.</p>
    <p><a href="/">Ana Sayfa</a></p>
  `);
});

// Dosya Yükleme
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
  
  console.log(`✅ Veri alındı → ${req.body.customerId}`);
  res.json({ success: true, message: "Veriler alındı" });
});

app.get('/files', (req, res) => {
  const folders = fs.readdirSync(uploadDir);
  res.json(folders);
});

app.get('/', (req, res) => {
  res.send('✅ Veri Kurtarma Backend Çalışıyor - Railway');
});

app.listen(PORT, () => console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`));
