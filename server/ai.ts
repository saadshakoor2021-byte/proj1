import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import { z } from 'zod';

const CounselRequest = z.object({
  question: z.string().min(1).max(4000),
  provider: z.enum(['gemini', 'nebius']).optional(),
});

type EnvMap = Record<string, string>;

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function systemPrompt() {
  return [
    'You are UniPath Pakistan, an admissions counselor for Pakistani students.',
    'Give practical advice on universities, eligibility, costs, scholarships, and application planning.',
    'Cite sources when you rely on public institutional facts. Label estimates clearly.',
    'If information is missing or uncertain, say so. Do not invent official fees or deadlines.',
  ].join(' ');
}

async function callGemini(question: string, env: EnvMap) {
  const apiKey = env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) return { ok: false as const, status: 503, error: 'Gemini is not configured on the server.' };

  const model = env.GEMINI_MODEL || 'gemini-2.0-flash';
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt() }] },
        contents: [{ role: 'user', parts: [{ text: question }] }],
      }),
    },
  );

  if (!response.ok) {
    return { ok: false as const, status: 502, error: 'Gemini request failed.' };
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const content = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('\n').trim();
  if (!content) {
    return { ok: false as const, status: 502, error: 'Gemini returned an empty response.' };
  }

  return {
    ok: true as const,
    content,
    sources: ['Google Gemini grounded generation'],
    uncertainty: 'Verify fees, deadlines, and requirements on official university pages.',
  };
}

async function callNebius(question: string, env: EnvMap) {
  const apiKey = env.NEBIUS_API_KEY;
  if (!apiKey) return { ok: false as const, status: 503, error: 'Nebius is not configured on the server.' };

  const endpoint = (env.NEBIUS_ENDPOINT || 'https://api.tokenfactory.nebius.com/v1').replace(/\/$/, '');
  const model = env.NEBIUS_MODEL || 'meta-llama/Meta-Llama-3.1-8B-Instruct';

  const response = await fetch(`${endpoint}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt() },
        { role: 'user', content: question },
      ],
    }),
  });

  if (!response.ok) {
    return { ok: false as const, status: 502, error: 'Nebius request failed.' };
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    return { ok: false as const, status: 502, error: 'Nebius returned an empty response.' };
  }

  return {
    ok: true as const,
    content,
    sources: ['Nebius Token Factory generation'],
    uncertainty: 'Verify fees, deadlines, and requirements on official university pages.',
  };
}

export async function handleAiRequest(req: IncomingMessage, res: ServerResponse, env: EnvMap) {
  const url = req.url?.split('?')[0] || '';
  if (!url.startsWith('/api/')) return false;

  if (req.method === 'GET' && url === '/api/ai/status') {
    sendJson(res, 200, {
      gemini: Boolean(env.GOOGLE_GEMINI_API_KEY),
      nebius: Boolean(env.NEBIUS_API_KEY),
    });
    return true;
  }

  if (req.method === 'POST' && url === '/api/counsel') {
    const raw = await readBody(req);
    let parsed: z.infer<typeof CounselRequest>;
    try {
      parsed = CounselRequest.parse(JSON.parse(raw || '{}'));
    } catch {
      sendJson(res, 400, { error: 'A valid question is required.' });
      return true;
    }

    const provider = parsed.provider || 'gemini';
    const result = provider === 'nebius'
      ? await callNebius(parsed.question, env)
      : await callGemini(parsed.question, env);

    if (!result.ok) {
      sendJson(res, result.status, { error: result.error, configured: result.status !== 503 });
      return true;
    }

    sendJson(res, 200, {
      content: result.content,
      sources: result.sources,
      uncertainty: result.uncertainty,
      live: true,
    });
    return true;
  }

  return false;
}

export function aiMiddlewarePlugin(env: EnvMap): Plugin {
  const attach = (server: { middlewares: { use: (fn: (req: IncomingMessage, res: ServerResponse, next: () => void) => void) => void } }) => {
    server.middlewares.use((req, res, next) => {
      void handleAiRequest(req, res, env)
        .then((handled) => {
          if (!handled) next();
        })
        .catch(() => {
          if (!res.headersSent) {
            sendJson(res, 500, { error: 'Counselor request failed.' });
          }
        });
    });
  };

  return {
    name: 'unipath-ai',
    configureServer: attach,
    configurePreviewServer: attach,
  };
}
