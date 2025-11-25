/**
 * server.js — Backend PDV Rochas Açaí
 * Suporta:
 *  - PIX
 *  - Débito
 *  - Crédito
 *
 * Requer no Render:
 *  MP_ACCESS_TOKEN=<seu token de produção do Mercado Pago>
 */

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");

// Token do Mercado Pago (configurado no Render)
const MP_TOKEN = process.env.MP_ACCESS_TOKEN || null;
const PORT = process.env.PORT || 3000;

if (!MP_TOKEN) {
  console.warn("⚠️ AVISO: MP_ACCESS_TOKEN não configurado. Pagamentos não vão funcionar.");
}

const app = express();

// Libera acesso da sua página (GitHub Pages)
app.use(cors());
app.use(bodyParser.json());

/* ============================================================
   Função para criar pagamento PIX
=============================================================== */
async function createPixPayment(amount, description) {
  const url = "https://api.mercadopago.com/v1/payments";

  const body = {
    transaction_amount: amount,
    description,
    payment_method_id: "pix",
    payer: {
      email: "cliente@rochasacai.com"
    }
  };

  const r = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MP_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  return await r.json();
}

/* ============================================================
   Função para criar preferência de cartão (débito/crédito)
=============================================================== */
async function createCardPreference(amount, description, method) {
  const url = "https://api.mercadopago.com/checkout/preferences";

  // Se for débito, exclui crédito. Se for crédito, exclui débito.
  const excluded =
    method === "debit"
      ? [{ id: "credit_card" }]
      : [{ id: "debit_card" }];

  const body = {
    items: [
      {
        title: description,
        quantity: 1,
        unit_price: amount
      }
    ],
    payment_methods: {
      excluded_payment_types: excluded,
      installments: method === "debit" ? 1 : 12
    }
  };

  const r = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MP_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  return await r.json();
}

/* ============================================================
   ENDPOINT: criar pagamento
   /create_payment?method=pix|debit|credit
=============================================================== */
app.post("/create_payment", async (req, res) => {
  try {
    const method = (req.query.method || "").toLowerCase();
    const { amount, description } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "amount required" });
    }

    // PIX
    if (method === "pix") {
      const pix = await createPixPayment(amount, description || "Pedido PDV Rochas Açaí");
      return res.json(pix);
    }

    // Débito ou Crédito
    if (method === "debit" || method === "credit") {
      const pref = await createCardPreference(amount, description || "Pedido PDV Rochas Açaí", method);
      return res.json(pref);
    }

    return res.status(400).json({ error: "invalid payment method" });

  } catch (err) {
    console.error("❌ ERRO /create_payment:", err);
    return res.status(500).json({
      error: "internal server error",
      details: err.toString()
    });
  }
});

/* ============================================================
   INICIA SERVIDOR
=============================================================== */
app.listen(PORT, () => {
  console.log(`🚀 Servidor PDV rodando na porta ${PORT}`);
});
  
