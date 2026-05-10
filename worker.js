export default {
  async fetch(req, env) {
    if (req.method !== 'POST') {
      return new Response('Only POST', { status: 405 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return new Response('Invalid JSON', { status: 400 });
    }

    const text = String(body?.text ?? '').trim();

    if (!text) {
      return new Response('Missing text', { status: 400 });
    }

    if (!text.startsWith('PENDIENTE_PAGO') && !text.startsWith('PENDIENTE_PAGO_TEST')) {
      return new Response('Ignored', { status: 200 });
    }

    const tgResp = await fetch(`https://api.telegram.org/bot${env.TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.TG_CHAT_ID,
        text,
      }),
    });

    const tgJson = await tgResp.json().catch(() => null);

    if (!tgResp.ok || !tgJson?.ok) {
      return new Response(`Telegram send failed: ${JSON.stringify(tgJson)}`, { status: 502 });
    }

    return new Response('ok', { status: 200 });
  },
};
