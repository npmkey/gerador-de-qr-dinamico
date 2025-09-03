let db = {}; // banco fake na memória (vai resetar a cada deploy)

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { id, data, expiresAt } = req.body;

    if (!id || !data || !expiresAt) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    db[id] = { data, expiresAt: new Date(expiresAt) };

    console.log('QR Code criado:', db[id]);

    return res.status(200).json({ success: true, message: 'QR code criado!' });
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
