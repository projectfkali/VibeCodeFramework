const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const runner = require('./runner');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const ROOT_DIR = path.resolve(__dirname, '../../');
const PROMPTS_DIR = path.join(ROOT_DIR, 'prompts');

// 1. Prompt Okuma API'si (Arayüz İçin)
app.get('/api/prompts/:name', (req, res) => {
  const promptName = req.params.name;
  const filePath = path.join(PROMPTS_DIR, `${promptName}.md`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Prompt dosyası bulunamadı.' });
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  res.json({ name: promptName, content: content });
});

// 2. Gerçek Otomasyon Tetikleme API'si
app.post('/api/run-workflow', async (req, res) => {
  const { workflowName, featureRequest, apiKey } = req.body;
  
  if (!workflowName || !apiKey) {
    return res.status(400).json({ error: 'Workflow adı ve API Anahtarı (API Key) zorunludur.' });
  }

  const result = await runner.executeRealSession(apiKey, workflowName, featureRequest);
  res.json({ message: 'Oturum tamamlandı.', data: result });
});

// 3. Coder (Uygulayıcı) API'si
app.post('/api/run-coder', async (req, res) => {
  const { apiKey, approvedPlan, targetFile } = req.body;
  
  if (!apiKey || !approvedPlan || !targetFile) {
    return res.status(400).json({ error: 'API Key, Onaylanmış Plan ve Hedef Dosya zorunludur.' });
  }

  const result = await runner.executeCoderSession(apiKey, approvedPlan, targetFile);
  res.json({ message: 'Kod üretildi.', data: result });
});

app.listen(PORT, () => {
  console.log(`VCF Otomasyon Sunucusu http://localhost:${PORT} adresinde çalışıyor...`);
});
