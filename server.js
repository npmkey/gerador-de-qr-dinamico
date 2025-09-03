const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Configuração CORS - ajuste o origin para seu frontend em produção
const corsOptions = {
  origin: '*', // Mude para a URL do seu frontend em produção, ex: 'https://meusite.com'
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Banco em memória
const qrCodes = {};

// Rota raiz
app.get('/', (req, res) => {
  res.send('✅ Servidor rodando! Backend QR Code ativo.');
});

// Criar QR Code
app.post('/create', (req, res) => {
  const { id, data, expiresAt } = req.body;

  if (!id || !data || !expiresAt) {
    return res.status(400).json({ success: false, error: 'Faltam dados no corpo da requisição.' });
  }

  qrCodes[id] = { data, expiresAt };
  console.log(`📦 QR Code salvo: ${id} → expira em ${expiresAt}`);

  res.json({ success: true, id });
});

// Buscar QR Code
app.get('/qrcode', (req, res) => {
  const { id } = req.query;

  console.log('Buscando QR Code para id:', id);
  console.log('QR Codes armazenados:', qrCodes);

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

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
