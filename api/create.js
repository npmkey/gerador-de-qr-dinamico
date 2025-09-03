
export default function handler(req, res) {
  if (req.method === 'POST') {
    const { id, data, expiresAt } = req.body;

    if (!id || !data || !expiresAt) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    console.log('Create:', id, data, expiresAt);

    return res.status(200).json({ success: true, message: 'QR code created' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
