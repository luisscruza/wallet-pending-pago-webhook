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

    const payload = {
      action: 'send',
      channel: 'telegram',
      target: env.OPENCLAW_TARGET_CHAT_ID,
      message: text,
    };

    const ocResp = await fetch(`${env.OPENCLAW_GATEWAY_URL}/tools/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENCLAW_GATEWAY_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const ocText = await ocResp.text();

    if (!ocResp.ok) {
      return new Response(`OpenClaw send failed: ${ocText}`, { status: 502 });
    }

    return new Response('ok', { status: 200 });
  },
};
