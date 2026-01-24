const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Firebase admin setup (make sure you set FIREBASE_ADMIN_SDK env var)
if (!admin.apps.length) {
  if (!process.env.FIREBASE_ADMIN_SDK) {
    throw new Error(
      "Missing FIREBASE_ADMIN_SDK env variable. Please set it to your Firebase credentials JSON."
    );
  }
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const db = admin.firestore();

app.post('/api/consent', async (req, res) => {
  try {
    const { consent, userAgent, geolocation, userId, email, name } = req.body;
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket?.remoteAddress ||
      req.connection?.remoteAddress ||
      null;

    await db.collection('cookie-consent').add({
      consent: consent || null,
      timestamp: new Date(),
      userAgent: userAgent || null,
      geolocation: geolocation || null,
      ip,
      userId: userId || null,
      email: email || null,
      name: name || null,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Consent API error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`API listening at http://localhost:${PORT}`);
});