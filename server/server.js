/**
 * server.js — Backend PDV Rochas Açaí
 */

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");

// TOKEN DO MERCADO PAGO (Render → Environment)
const MP_TOKEN = process.env.MP_ACCESS_TOKEN || null;
const PORT = process.env.PORT || 3000;

if (!MP_TOKEN) {
  console.warn("⚠️ AVISO: MP_ACCESS_TOKEN não configurado. Pagamentos não vão funcionar.");
}

const app = express();

// libera acesso ao front-end
app.use(cors());
app.use(bodyParser.json());

// rota PIX
async function createPix(amount, description) {
  const url = "https://api.mercadopago.com/v1/payments";

  const body = {
    transaction_amount: amount,
    description,
    payment_method_id: "pix",
    payer: { email: "cliente@teste.com" }
  };

  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${MP_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  return await r.json();
}

// rota crédito/débito
async function createPreference(amount, description, options) {
  const url = "https://api.mercadopago.com/checkout/preferences";

  const body = {
    items: [
      {
        title: description,
        quantity: 1,
        unit_price: amount
      }
    ],
    payment_methods: options.payment_methods
  };

  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${MP_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  return await r.json();
}

// endpoint final
app.post("/create_payment", async (req, res) => {
  try {
    const method = (req.query.method || "").toLowerCase();
    const { amount, description } = req.body;

    if (!amount) return res.status(400).json({ error: "amount required" });

    if (method === "pix") {
      const pix = await createPix(amount, description);
      return res.json(pix);
    }

    if (method === "debit" || method === "credit") {
      const excluded =
        method === "debit"
          ? [{ id: "credit_card" }]
          : [{ id: "debit_card" }];

      const options = {
        payment_methods: {
          excluded_payment_types: excluded,
          installments: method === "debit" ? 1 : 12
        }
      };

      const pref = await createPreference(amount, description, options);
      return res.json(pref);
    }

    return res.status(400).json({ error: "invalid method" });

  } catch (e) {
    console.error("ERRO /create_payment:", e);
    return res.status(500).json({ error: "internal error" });
  }
});

// inicia servidor
app.listen(PORT, () =>
  console.log(`🚀 Servidor PDV rodando na porta ${PORT}`)
)
