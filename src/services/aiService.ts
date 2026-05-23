import type { MenuCategory, MenuItem } from '../types/menu';

// Use Cloudflare Worker proxy to hide API key (recommended for production)
// Set VITE_AI_PROXY_URL in .env with your Worker URL, e.g. https://taptop-menu-ai.your-subdomain.workers.dev
const AI_PROXY_URL = import.meta.env.VITE_AI_PROXY_URL || '';

// Direct OpenAI API (only used as fallback for local dev without proxy)
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Supported languages for menu translation
const TARGET_LANGUAGES = ['en', 'zh', 'fr', 'de', 'es', 'it', 'ja', 'ko'];

function getApiKey(): string {
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  if (!key && !AI_PROXY_URL) {
    throw new Error('No AI endpoint configured. Set VITE_AI_PROXY_URL or VITE_OPENAI_API_KEY in your .env file.');
  }
  return key || '';
}

function isUsingProxy(): boolean {
  return !!AI_PROXY_URL;
}

interface AIAnalysisResult {
  storeName?: string;
  categories: {
    name: string;
    name_translations: Record<string, string>;
    items: {
      name: string;
      name_translations: Record<string, string>;
      description: string;
      description_translations: Record<string, string>;
      price: number | string;
      allergens?: string[];
      tags?: string[];
    }[];
  }[];
}

/**
 * Convert AI analysis result to MenuCategory array
 */
function convertToMenuCategories(result: AIAnalysisResult): MenuCategory[] {
  return result.categories.map((cat) => ({
    id: generateId(),
    name: cat.name,
    translations: cat.name_translations || { en: cat.name },
    items: cat.items.map((item) => {
      const price = typeof item.price === 'string'
        ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
        : item.price;

      return {
        id: generateId(),
        name: item.name,
        description: item.description || '',
        price: isNaN(price) ? 0 : price,
        category: cat.name,
        translations: {
          en: { name: item.name, description: item.description || '' },
          ...Object.fromEntries(
            Object.entries(item.name_translations || {}).map(([lang, name]) => [
              lang,
              {
                name,
                description: (item.description_translations || {})[lang] || item.description || '',
              },
            ])
          ),
        },
        allergens: item.allergens || [],
        tags: item.tags || [],
      } as MenuItem;
    }),
  }));
}

function generateId(): string {
  return `ai_${Math.random().toString(36).substring(2, 11)}_${Date.now().toString(36)}`;
}

/**
 * Analyze a menu image using OpenAI GPT-4o Vision (via proxy for production).
 * Extracts menu items, categories, prices, and translates to multiple languages.
 * 
 * GDPR Note: Images are sent to OpenAI API for processing only.
 * Data is not stored by this service. OpenAI's data usage policy
 * for API customers does not train on API data.
 */
export async function analyzeMenuImage(
  imageBase64: string,
  targetLangs: string[] = TARGET_LANGUAGES,
  onProgress?: (progress: number, message: string) => void
): Promise<MenuCategory[]> {
  onProgress?.(10, 'Uploading image for analysis...');

  const prompt = `You are a professional menu digitization assistant for restaurants. Analyze this menu image and extract ALL items with full details.

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
            "en": "...",
            "zh": "...",
            "fr": "...",
            "de": "...",
            "es": "...",
            "ja": "...",
            "ko": "..."
          },
          "description": "Description in original language or empty string",
          "description_translations": {
            "en": "...",
            "zh": "...",
            "fr": "...",
            "de": "...",
            "es": "...",
            "ja": "...",
            "ko": "..."
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

Target languages for translation: ${targetLangs.join(', ')}`;

  onProgress?.(30, 'Analyzing menu with AI...');

  let data: any;

  if (isUsingProxy()) {
    // Route through Cloudflare Worker proxy (no API key in frontend)
    const proxyResponse = await fetch(AI_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64, prompt, model: 'gpt-4o' }),
    });

    if (!proxyResponse.ok) {
      const errorData = await proxyResponse.json().catch(() => ({}));
      throw new Error(`AI proxy error (${proxyResponse.status}): ${errorData.error || 'Unknown error'}`);
    }

    data = await proxyResponse.json();
  } else {
    // Direct OpenAI call (local dev only)
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getApiKey()}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64,
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

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
    }

    data = await response.json();
  }

  onProgress?.(70, 'Processing results...');

  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('No response from AI. Please try again.');
  }

  onProgress?.(85, 'Structuring menu data...');

  let result: AIAnalysisResult;
  try {
    result = JSON.parse(content);
  } catch {
    throw new Error('Failed to parse AI response. The image may be unclear or not a menu.');
  }

  if (!result.categories || result.categories.length === 0) {
    throw new Error('No menu items detected in the image. Please try a clearer photo.');
  }

  onProgress?.(95, 'Finalizing...');

  const categories = convertToMenuCategories(result);

  onProgress?.(100, 'Done!');
  return categories;
}

/**
 * Translate text using OpenAI (fallback for individual translation)
 */
export async function translateText(
  text: string,
  targetLang: string,
  context?: string
): Promise<string> {
  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a restaurant menu translator. Translate to ${targetLang}. ${context ? `Context: ${context}` : ''} Return only the translation, no explanations.`,
        },
        { role: 'user', content: text },
      ],
      max_tokens: 200,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`Translation failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || text;
}
