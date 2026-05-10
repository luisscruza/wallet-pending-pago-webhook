# Wallet Pending Pago Webhook (Cloudflare Worker)

Webhook mínimo para recibir eventos desde Atajos (iPhone) y reenviarlos por Telegram.

## Requisitos
- Node.js 18+
- Wrangler CLI (`npm i -g wrangler`)
- Cuenta de Cloudflare

## Setup
```bash
wrangler login
wrangler secret put TG_TOKEN
wrangler deploy
```

## Endpoint
Este worker espera `POST` con JSON:

```json
{
  "text": "PENDIENTE_PAGO_TEST\nComercio: ...\nImporte: ...\nTarjeta: ...\nFecha y hora: ..."
}
```

Solo reenvía mensajes que empiecen por `PENDIENTE_PAGO` o `PENDIENTE_PAGO_TEST`.

## Atajos (iPhone)
- Acción: **Get Contents of URL**
- Method: `POST`
- Request Body: `JSON`
- URL: tu `https://...workers.dev`
- Body: campo `text` con el payload.

## Seguridad
- No commitear tokens.
- Rotar el token del bot tras pruebas.
