const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: '*', // Em produção, especifique seu domínio, ex: 'https://meusite.com'
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(express.json());

const qrCodes = {};

app.get('/', (req, res) => {
  res.send('✅ Servidor rodando! Backend QR Code ativo.');
});

app.post('/create', (req, res) => {
  const { id, data, expiresAt } = req.body;

  if (!id || !data || !expiresAt) {
    return res.status(400).json({ success: false, error: 'Faltam dados no corpo da requisição.' });
  }

  qrCodes[id] = { data, expiresAt };
  console.log(`📦 QR Code salvo: ${id} → expira em ${expiresAt}`);

  res.json({ success: true, id });
});

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

  // Se o dado for link, redireciona
  if (data.startsWith('http://') || data.startsWith('https://')) {
    return res.redirect(data);
  }

  res.send(`✅ QR Code válido! Conteúdo: ${data}`);
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
