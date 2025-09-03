
let db = {}; // Deve ser o mesmo db do create.js, mas no serverless não é compartilhado entre requisições!
// Para demo, vamos fingir que é o mesmo.

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ success: false, message: 'ID não informado' });
    }

    // Aqui só demo: em serverless, o db não persiste entre requisições, então
    // você deveria usar banco externo (ex: Firebase, MongoDB, etc)
    // Para demo, só retorna uma mensagem fixa:
    return res.status(200).json({ success: true, data: `QR code para id ${id} (dados fake)` });
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
