const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 5001;

const pool = new Pool({
  host: 'dpg-d4v8gfruibrs73d33750-a.oregon-postgres.render.com',
  user: 'apex_media_10',              
  password: 'l0GqUC5AAqkbiP1Ol3JtWERc0uil7y3m', 
  database: 'apex_media',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());

app.post('/api/consent', async (req, res) => {
  try {
    const { consent, userAgent, geolocation, userId, email, name } = req.body;
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket?.remoteAddress ||
      req.connection?.remoteAddress ||
      null;
    
    console.log('Received consent data:', { consent, userAgent, geolocation, ip, userId, email, name });

    const query = `
      INSERT INTO cookie_consent (consent, timestamp, user_agent, geolocation, ip, user_id, email, name)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    await pool.query(query, [
      consent,
      new Date(),
      userAgent,
      geolocation,
      ip,
      userId,
      email,
      name
    ]);

    console.log('Insert succeeded.');
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Consent API error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Consent API listening at http://localhost:${PORT}`);
});


