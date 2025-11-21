/**
 * server.js - PDV backend
 * - Serves static files from /public
 * - Endpoint POST /create_payment?method=debit|credit|pix
 * - WebSocket /ws to emit weight from local serial port (fallback)
 *
 * Usage:
 *   MP_ACCESS_TOKEN=APP_USR-... SERIAL_PORT=/dev/ttyUSB0 node server.js
 */

const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // v2
const http = require('http');
const { Server } = require('socket.io');

const MP_TOKEN = process.env.MP_ACCESS_TOKEN || null;
const PORT = process.env.PORT || 3000;

if (!MP_TOKEN) {
  console.warn('WARNING: MP_ACCESS_TOKEN not set. Payments will fail until you configure it as environment variable.');
}

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

/* ---------- create preference (checkout) ---------- */
async function createPreference(amount, description, options = {}) {
  const body = {
    items: [{
      title: description || 'Produto',
      quantity: 1,
      unit_price: parseFloat(amount),
      currency_id: 'BRL'
    }],
    ...options
  };

  const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${MP_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return await r.json();
}

/* ---------- create pix payment (Payments API) ---------- */
async function createPixPayment(amount, description) {
  const body = {
    transaction_amount: parseFloat(amount),
    description: description || 'Produto',
    payment_method_id: 'pix',
    payer: { email: 'cliente@exemplo.com' }
  };

  const r = await fetch('https://api.mercadopago.com/v1/payments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${MP_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  return await r.json();
}

/* ---------- Endpoint: create payment ---------- */
app.post('/create_payment', async (req, res) => {
  try {
    const method = (req.query.method || '').toLowerCase();
    const { amount, description } = req.body;

    if (!amount) return res.status(400).json({ error: 'amount required' });

    if (method === 'debit' || method === 'credit') {
      const excluded =
        method === 'debit'
          ? [{ id: 'credit_card' }]
          : [{ id: 'debit_card' }];

      const options = {
        payment_methods: {
          excluded_payment_types: excluded,
          installments: method === 'debit' ? 1 : 12
        }
      };

      const pref = await createPreference(amount, description, options);
      return res.json(pref);
    }

    if (method === 'pix') {
      const pix = await createPixPayment(amount, description);
      return res.json(pix);
    }

    const pref = await createPreference(amount, description, {});
    res.json(pref);

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message, stack: e.stack });
  }
});

/* ---------- SERVER + Websocket fallback ---------- */
const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on('connection', socket => {
  console.log('ws conn');
});

/* ---------- OPTIONAL: Serial port fallback ---------- */
const SERIAL_PATH = process.env.SERIAL_PORT || null;

if (SERIAL_PATH) {
  try {
    const SerialPort = require('serialport');
    const Readline = require('@serialport/parser-readline');

    const port = new SerialPort(SERIAL_PATH, {
      baudRate: parseInt(process.env.SERIAL_BAUD || '9600')
    });
    const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

    parser.on('data', line => {
      const m = line.match(/-?\d+[\.,]?\d*/);
      if (m) {
        let val = parseFloat(m[0].replace(',', '.'));

        if (/kg/i.test(line) && val < 1000) val *= 1000;

        io.emit('weight', { type: 'weight', weight: val });
      }
    });

    console.log('Serial listening:', SERIAL_PATH);

  } catch (e) {
    console.warn('serialport module not found:', e.message);
  }
}

httpServer.listen(PORT, () =>
  console.log(`Backend running at http://localhost:${PORT}`)
);
