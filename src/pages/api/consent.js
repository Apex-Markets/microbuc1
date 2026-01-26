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

// ========== NEW /api/persona endpoint ==========
app.post('/api/persona', async (req, res) => {
  try {
    const {
      deviceId,
      userAgent,
      language,
      screen,
      timezone,
      platform,
      referrer,
      geolocation
    } = req.body;

    // Save persona record or update if present (UPSERT)
    // You need a table like "persona" (see SQL note below)
    const query = `
      INSERT INTO persona
        (device_id, user_agent, language, screen_width, screen_height, timezone, platform, referrer, geolocation, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      ON CONFLICT (device_id) DO UPDATE
        SET user_agent = EXCLUDED.user_agent,
            language   = EXCLUDED.language,
            screen_width   = EXCLUDED.screen_width,
            screen_height  = EXCLUDED.screen_height,
            timezone   = EXCLUDED.timezone,
            platform   = EXCLUDED.platform,
            referrer   = EXCLUDED.referrer,
            geolocation= EXCLUDED.geolocation,
            updated_at = NOW();
    `;

    await pool.query(query, [
      deviceId,
      userAgent,
      language,
      screen?.width || null,
      screen?.height || null,
      timezone,
      platform,
      referrer,
      geolocation ? JSON.stringify(geolocation) : null
    ]);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Persona API error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Existing /api/consent endpoint (unchanged)
app.post('/api/consent', async (req, res) => {
  try {
    console.log("Consent payload received:", req.body);
    const { consent, userAgent, geolocation, userId, email, name, deviceId } = req.body;
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket?.remoteAddress ||
      req.connection?.remoteAddress ||
      null;

    const query = `
      INSERT INTO cookie_consent (consent, timestamp, user_agent, geolocation, ip, user_id, email, name, device_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    await pool.query(query, [
      consent,
      new Date(),
      userAgent,
      geolocation,
      ip,
      userId,
      email,
      name,
      deviceId
    ]);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Consent API error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/session', async (req, res) => {
  try {
    const {
      type, button, count, value,
      userId, email, name, userAgent, page, geolocation
    } = req.body;

    const query = `
      INSERT INTO cookie_banner_events
        (user_id, email, name, event_type, button, count, value, user_agent, page, geolocation)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    `;

    await pool.query(query, [
      userId,
      email,
      name,
      type,
      button,
      count,
      value,
      userAgent,
      page,
      geolocation
    ]);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Session API error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/dbtest', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1');
    res.json({ ok: true, result: result.rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Consent API listening at http://localhost:${PORT}`);
});