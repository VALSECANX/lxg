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

// ======================== APK İNDİRME SAYFASI ========================
app.get('/apk/:customerId.apk', (req, res) => {
  const customerId = req.params.customerId;
  
  res.send(`
    <h1 style="text-align:center; color:#00ff88; font-family:Arial; margin-top:40px;">📱 Veri Kurtarma Pro</h1>
    <div style="text-align:center; margin-top:50px; padding:30px; font-family:Arial;">
      <h2>APK İndirme Sayfası</h2>
      <p><strong>Müşteri ID:</strong> ${customerId}</p>
      <br><br>
      <p>Bu kısım yakında <strong>gerçek APK</strong> dosyası ile değiştirilecek.</p>
      <p>Şu anda test aşamasındayız.</p>
      <br>
      <a href="/" style="color:#00ff88; font-size:18px;">← Ana Sayfaya Dön</a>
    </div>
  `);
});

// ======================== DOSYA YÜKLEME ========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const customerId = req.body.customerId || 'unknown_' + Date.now();
    const dir = path.join(uploadDir, customerId);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Dosya gelmedi" });
  }

  console.log(`✅ Yeni veri alındı! Müşteri: ${req.body.customerId || 'Bilinmiyor'}`);
  console.log(`Dosya: ${req.file.filename}`);

  res.json({
    success: true,
    message: "Veriler başarıyla alındı",
    filename: req.file.filename,
    customerId: req.body.customerId
  });
});

// ======================== DİĞER SAYFALAR ========================
app.get('/files', (req, res) => {
  const folders = fs.readdirSync(uploadDir);
  res.json(folders);
});

app.get('/', (req, res) => {
  res.send('✅ Veri Kurtarma Backend Çalışıyor - Railway');
});

app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
});
