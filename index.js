import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { randomUUID } from 'crypto';

const app = express();

app.use(cors());
app.use(express.json());

const url = 'https://api.mercadopago.com/v1/payments';

// Rota para criar pagamento dinamicamente
app.post('/criar-pagamento', (req, res) => {
  const idempotencyKey = randomUUID();

  // 🔽 Extrai dados enviados pelo SAP Build Apps
  const {
    transaction_amount,
    description,
    email,
    first_name,
    last_name
  } = req.body;

  // ✅ Verifica se os campos obrigatórios foram enviados
  if (!transaction_amount || !email) {
    return res.status(400).json({
      erro: 'Campos obrigatórios ausentes: transaction_amount e email são obrigatórios.'
    });
  }

  const data = {
    transaction_amount,
    description: description || 'Pagamento via PIX',
    payment_method_id: "pix",
    payer: {
      email,
      first_name: first_name || '',
      last_name: last_name || ''
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
