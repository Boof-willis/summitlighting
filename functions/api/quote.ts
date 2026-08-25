// Cloudflare Pages Function: receives quote-form submissions and emails the
// lead to the business via the Cloudflare Email Service REST API (the
// send_email binding is Workers-only; Pages projects use the REST API).
//
// Prerequisites (one-time, after DNS moves to Cloudflare):
//   1. npx wrangler email sending enable summitlightingco.com
//   2. In the Pages project (Settings -> Variables and Secrets) add:
//        CF_ACCOUNT_ID    - the Cloudflare account ID
//        SUMMIT_LIGHTING_EMAIL - an API token with Email Sending permission

interface QuotePayload {
  selectedPropertyType?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  cityOrZip?: string;
  description?: string;
  consentGiven?: boolean;
  website?: string; // honeypot
  timestamp?: string;
  pageSource?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
}

interface Env {
  // Set in the Pages project: Settings -> Variables and Secrets
  CF_ACCOUNT_ID: string;
  SUMMIT_LIGHTING_EMAIL: string; // API token with Email Sending permission
}

const TO_ADDRESS = 'info@summitlightingco.com';
const FROM_ADDRESS = 'quotes@summitlightingco.com';

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  let data: QuotePayload;
  try {
    data = await request.json();
  } catch {
    return json(400, { ok: false, error: 'Invalid JSON' });
  }

  // Honeypot: bots that filled the invisible field get a fake success and
  // no email is sent. Enforced here so it can't be bypassed client-side.
  if (typeof data.website === 'string' && data.website.trim() !== '') {
    return json(200, { ok: true });
  }

  // Minimal validation - mirror the client rules
  const name = (data.fullName || '').trim();
  const phone = (data.phone || '').replace(/\D/g, '');
  const email = (data.email || '').trim();
  const city = (data.cityOrZip || '').trim();
  const property = (data.selectedPropertyType || '').trim();
  if (name.length < 2 || phone.length !== 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || city.length < 2 || !property) {
    return json(400, { ok: false, error: 'Missing or invalid fields' });
  }

  const lines: [string, string | undefined][] = [
    ['Name', name],
    ['Phone', data.phone],
    ['Email', email],
    ['City/ZIP', city],
    ['Property', property],
    ['Details', data.description?.trim() || undefined],
    ['Submitted from', data.pageSource],
    ['Referrer', data.referrer || undefined],
    ['UTM source', data.utm_source],
    ['UTM medium', data.utm_medium],
    ['UTM campaign', data.utm_campaign],
    ['UTM term', data.utm_term],
    ['UTM content', data.utm_content],
    ['gclid', data.gclid],
    ['gbraid', data.gbraid],
    ['wbraid', data.wbraid],
    ['Timestamp', data.timestamp],
  ];
  const present = lines.filter(([, v]) => v);

  const text = `New quote request\n\n${present.map(([k, v]) => `${k}: ${v}`).join('\n')}\n`;
  const html = `<h2>New quote request</h2><table cellpadding="4">${present
    .map(([k, v]) => `<tr><td><strong>${esc(k)}</strong></td><td>${esc(String(v))}</td></tr>`)
    .join('')}</table>`;

  if (!env.CF_ACCOUNT_ID || !env.SUMMIT_LIGHTING_EMAIL) {
    console.error('Email secrets not configured (CF_ACCOUNT_ID / SUMMIT_LIGHTING_EMAIL)');
    return json(502, { ok: false, error: 'Email not configured' });
  }

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/email/sending/send`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.SUMMIT_LIGHTING_EMAIL}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: TO_ADDRESS,
          from: { address: FROM_ADDRESS, name: 'Summit Lighting Website' },
          reply_to: email,
          subject: `Quote request: ${property} in ${city} - ${name}`,
          text,
          html,
        }),
      }
    );
    if (!res.ok) {
      console.error('Email send failed:', res.status, await res.text());
      return json(502, { ok: false, error: 'Email delivery failed' });
    }
  } catch (err) {
    console.error('Email send failed:', err);
    return json(502, { ok: false, error: 'Email delivery failed' });
  }

  return json(200, { ok: true });
};
