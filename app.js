/** server.js – Backend PDV Rochas Açaí */

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");

// TOKEN DO MERCADO PAGO (Render)
const MP_TOKEN = process.env.MP_ACCESS_TOKEN || null;
const PORT = process.env.PORT || 3000;

if (!MP_TOKEN) {
    console.warn("⚠️ AVISO: MP_ACCESS_TOKEN não configurado. Pagamentos não vão funcionar.");
}

const app = express();

// libera front-end
app.use(cors());
app.use(bodyParser.json());

/* ============================================================
   PIX
=============================================================== */
async function createPixPayment(amount, description) {
    const url = "https://api.mercadopago.com/v1/payments";

    const body = {
        transaction_amount: amount,
        description,
        payment_method_id: "pix",
        payer: { email: "pagador@acai.com" }
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
   CARTÃO (CRÉDITO/DÉBITO)
=============================================================== */
async function createCardPreference(amount, description, method) {
    const url = "https://api.mercadopago.com/checkout/preferences";

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
   ENDPOINT DE PAGAMENTO
=============================================================== */
app.post("/create_payment", async (req, res) => {
    try {
        const method = (req.query.method || "").toLowerCase();
        const { amount, description } = req.body;

        if (!amount) {
            return res.status(400).json({ error: "amount required" });
        }

        if (method === "pix") {
            const pix = await createPixPayment(amount, description);
            return res.json(pix);
        }

        if (method === "debit" || method === "credit") {
            const pref = await createCardPreference(amount, description, method);
            return res.json(pref);
        }

        return res.status(400).json({ error: "invalid payment method" });

    } catch (e) {
        console.error("❌ ERRO /create_payment:", e);
        return res.status(500).json({ error: "internal server error", details: e.toString() });
    }
});

/* ============================================================
   SERVIDOR
=============================================================== */
app.listen(PORT, () => {
    console.log(`🚀 Servidor PDV rodando na porta ${PORT}`);
});
