const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// ✅ CONFIGURAÇÃO CORRETA DO CORS
const corsOptions = {
  origin: '*', // Em produção, troque '*' por: 'https://seusite.vercel.app'
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Banco de dados em memória
const qrCodes = {};

// Rota raiz
app.get('/', (req, res) => {
  res.send('✅ Servidor rodando! Backend QR Code ativo.');
});

// Rota de criação de QR Code
app.post('/create', (req, res) => {
  const { id, data, expiresAt } = req.body;

  if (!id || !data || !expiresAt) {
    return res.status(400).json({ success: false, error: 'Faltam dados no corpo da requisição.' });
  }

  qrCodes[id] = { data, expiresAt };
  console.log(`📦 QR Code salvo: ${id} → expira em ${expiresAt}`);

  res.json({ success: true, id });
});

// Rota de verificação de QR Code
app.get('/qrcode', (req, res) => {
  const { id } = req.query;

  if (!id || !qrCodes[id]) {
    return res.status(404).send('❌ QR Code não encontrado.');
  }

  const { data, expiresAt } = qrCodes[id];
  const now = new Date();

  if (new Date(expiresAt) < now) {
    return res.status(410).send('⛔ QR Code expirado.');
  }

  res.send(`✅ QR Code válido! Conteúdo: ${data}`);
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
