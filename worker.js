export default {
  async fetch(req, env) {
    try {
      if (req.method !== 'POST') return new Response('Only POST', { status: 405 });

      const body = await req.json().catch(() => null);
      if (!body) return new Response('Invalid JSON', { status: 400 });

      const text = String(body?.text ?? '').trim();
      if (!text) return new Response('Missing text', { status: 400 });

      if (!text.startsWith('PENDIENTE_PAGO') && !text.startsWith('PENDIENTE_PAGO_TEST')) {
        return new Response('Ignored', { status: 200 });
      }

      const invokePayload = {
        tool: 'message',
        args: {
          action: 'send',
          channel: 'telegram',
          target: env.OPENCLAW_TARGET_CHAT_ID,
          message: text,
        },
        sessionKey: 'main',
      };

      const ocResp = await fetch(`${env.OPENCLAW_GATEWAY_URL}/tools/invoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.OPENCLAW_GATEWAY_TOKEN}`,
        },
        body: JSON.stringify(invokePayload),
      });

      const ocText = await ocResp.text();
      if (!ocResp.ok) {
        return new Response(`OpenClaw invoke failed (${ocResp.status}): ${ocText}`, { status: 502 });
      }

      return new Response(`ok: ${ocText}`, { status: 200 });
    } catch (e) {
      return new Response(`Worker error: ${e?.stack || e?.message || String(e)}`, { status: 500 });
    }
  },
};
