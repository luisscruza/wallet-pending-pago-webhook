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

      const hookResp = await fetch(env.WALLET_HOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const hookText = await hookResp.text();
      if (!hookResp.ok) {
        return new Response(`wallet hook failed (${hookResp.status}): ${hookText}`, { status: 502 });
      }

      return new Response(`ok: ${hookText}`, { status: 200 });
    } catch (e) {
      return new Response(`Worker error: ${e?.stack || e?.message || String(e)}`, { status: 500 });
    }
  },
};
