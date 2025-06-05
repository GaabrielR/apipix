import express from 'express';
import fetch from 'node-fetch';
import { randomUUID } from 'crypto';

const app = express();
app.use(express.json());

const url = 'https://api.mercadopago.com/v1/payments';

app.post('/criar-pagamento', (req, res) => {
  const idempotencyKey = randomUUID();

  const data = {
    transaction_amount: 0.10,
    description: "Pagamento via PIX",
    payment_method_id: "pix",
    payer: {
      email: "gustavo.oliveira.a@hotmail.com",
      first_name: "CARTA",
      last_name: "TESRTE"
    }
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Idempotency-Key': idempotencyKey,
      'Authorization': 'Bearer APP_USR-2331163127556355-060414-42e5e434da6f668f9493b7806a52e682-444031952'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(result => {
    console.log('✅ Pagamento criado:', result);
    res.json(result);
  })
  .catch(error => {
    console.error('❌ Erro ao criar pagamento:', error);
    res.status(500).json({ erro: error.message });
  });
});

app.get('/', (req, res) => {
  res.send('🚀 API MercadoPago PIX rodando!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
