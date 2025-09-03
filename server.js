const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Habilita CORS para permitir chamadas do frontend
app.use(cors());

// Habilita leitura de JSON no corpo das requisições
app.use(express.json());

// "Banco de dados" simples em memória
const qrCodes = {}; // Ex: { id123: { data: 'algum texto', expiresAt: '2025-09-04T00:00:00Z' } }

// Rota de teste (raiz)
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

// Rota para verificar QR Code
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

// Inicia o servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em: http://localhost:${port}`);
});
