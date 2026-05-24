/**
 * Cloudflare Worker — OpenAI GPT-4o Proxy
 * 
 * Protects OpenAI API key from exposure in frontend code.
 * Only accepts requests from allowed origins.
 * 
 * Deploy:  npx wrangler deploy
 * Secrets: npx wrangler secret put OPENAI_API_KEY
 */

interface Env {
  OPENAI_API_KEY: string;
  ALLOWED_ORIGINS: string;
}

// Simple in-memory rate limiter (resets on worker cold start)
const RATE_LIMIT = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_MINUTE = 30;

function isOriginAllowed(origin: string | null, allowedOrigins: string): boolean {
  if (!origin) return false;
  const allowed = allowedOrigins.split(',').map(s => s.trim());
  return allowed.includes(origin);
}

function rateLimitExceeded(ip: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT.get(ip);
  
  if (!entry || now > entry.resetAt) {
    RATE_LIMIT.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  
  entry.count++;
  return entry.count > MAX_REQUESTS_PER_MINUTE;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS(request, env);
    }

    // Only POST allowed
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Origin check
    const origin = request.headers.get('Origin');
    if (!isOriginAllowed(origin, env.ALLOWED_ORIGINS)) {
      return new Response('Forbidden: origin not allowed', { status: 403 });
    }

    // Rate limit
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (rateLimitExceeded(ip)) {
      return new Response('Too many requests. Please wait a moment.', { status: 429 });
    }

    // Parse request body
    let body: { image?: string; prompt?: string; model?: string };
    try {
      body = await request.json();
    } catch {
      return new Response('Invalid JSON', { status: 400 });
    }

    if (!body.image) {
      return new Response('Missing "image" field (base64)', { status: 400 });
    }

    const prompt = body.prompt || buildMenuAnalysisPrompt();
    const model = body.model || 'gpt-4o';

    // Call OpenAI API
    try {
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image_url',
                  image_url: {
                    url: body.image,
                    detail: 'high',
                  },
                },
              ],
            },
          ],
          max_tokens: 4096,
          temperature: 0.3,
          response_format: { type: 'json_object' },
        }),
      });

      const data: any = await openAIResponse.json();

      if (!openAIResponse.ok) {
        return new Response(JSON.stringify({ 
          error: data.error?.message || `OpenAI error (${openAIResponse.status})` 
        }), {
          status: 502,
          headers: corsHeaders(origin),
        });
      }

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          ...corsHeaders(origin),
          'Content-Type': 'application/json',
        },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message || 'Internal error' }), {
        status: 500,
        headers: corsHeaders(origin),
      });
    }
  },
};

function handleCORS(request: Request, env: Env): Response {
  const origin = request.headers.get('Origin');
  if (isOriginAllowed(origin, env.ALLOWED_ORIGINS)) {
    return new Response(null, { status: 204, headers: corsHeaders(origin!) });
  }
  return new Response(null, { status: 204 });
}

function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function buildMenuAnalysisPrompt(): string {
  const langs = ['en', 'zh', 'fr', 'de', 'es', 'it', 'ja', 'ko'];
  return `You are a professional menu digitization assistant for restaurants. Analyze this menu image and extract ALL items with full details.

Return a JSON object in exactly this format (no markdown, no explanations):

{
  "storeName": "Restaurant name if visible, otherwise null",
  "categories": [
    {
      "name": "Category name in original language",
      "name_translations": {
        "en": "English translation",
        "zh": "中文翻译",
        "fr": "French translation",
        "de": "German translation",
        "es": "Spanish translation",
        "ja": "Japanese translation",
        "ko": "Korean translation"
      },
      "items": [
        {
          "name": "Item name in original language",
          "name_translations": {
            "en": "...", "zh": "...", "fr": "...", "de": "...", "es": "...", "ja": "...", "ko": "..."
          },
          "description": "Description in original language or empty string",
          "description_translations": {
            "en": "...", "zh": "...", "fr": "...", "de": "...", "es": "...", "ja": "...", "ko": "..."
          },
          "price": 12.99,
          "allergens": ["gluten", "milk"] or [],
          "tags": ["spicy", "vegetarian"] or []
        }
      ]
    }
  ]
}

RULES:
1. Extract EVERY item visible in the image, no matter how many
2. Preserve original names and descriptions exactly as shown
3. Provide NATURAL translations (not word-for-word) for ALL target languages
4. Parse prices as numbers (remove currency symbols, e.g., "€12,50" → 12.50)
5. Detect allergens from ingredients/descriptions (use: gluten, crustaceans, eggs, fish, peanuts, soybeans, milk, nuts, celery, mustard, sesame, sulphites, lupin, molluscs)
6. Detect tags: spicy, vegetarian, vegan, gluten-free, signature, new, popular, healthy
7. For each description_translations, provide the translated description in each language
8. Group items logically by category (Appetizers, Main Course, Desserts, etc.)
9. If no clear category grouping, create reasonable categories
10. Return ONLY the JSON, no other text

Target languages for translation: ${langs.join(', ')}`;
}
