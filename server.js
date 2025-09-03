const express = require('express');
const cors = require('cors');
const app = express();

// Porta que o Railway vai usar via variável de ambiente ou padrão 3000 local
const port = process.env.PORT || 3000;

// Middleware para permitir requisições CORS (de qualquer origem)
app.use(cors());

// Middleware para interpretar JSON no corpo da requisição
app.use(express.json());

// "Banco de dados" simples em memória
const qrCodes = {}; // Exemplo: { id123: { data: 'texto', expiresAt: '2025-09-04T00:00:00Z' } }

// Rota raiz para testar se o servidor está online
app.get('/', (req, res) => {
  res.send('✅ Servidor rodando! Backend QR Code ativo.');
});

// Rota para criar um novo QR code
app.post('/create', (req, res) => {
  const { id, data, expiresAt } = req.body;

  if (!id || !data || !expiresAt) {
    return res.status(400).json({ success: false, error: 'Faltam dados no corpo da requisição.' });
  }

  qrCodes[id] = { data, expiresAt };

  console.log(`📦 QR Code salvo: ${id} → expira em ${expiresAt}`);

  res.json({ success: true, id });
});

// Rota para acessar o QR code, verifica validade
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

// Inicializa o servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
