export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function simulateAIGeneration(prompt: string, wordCount: number): Promise<string> {
  await delay(1500 + Math.random() * 1000);
  
  const templates = [
    `I recently visited ${prompt} and had an absolutely wonderful experience. The service was exceptional, and the staff went above and beyond to ensure everything was perfect. From the moment I arrived, I was greeted with warm hospitality and made to feel welcome.`,
    `My experience at ${prompt} exceeded all expectations. The attention to detail was remarkable, and the quality of service was outstanding. I particularly appreciated the professional and friendly approach of the entire team.`,
    `What a fantastic experience! ${prompt} truly delivers on its promise of excellence. The atmosphere was inviting, the service was impeccable, and every aspect of my visit was carefully considered. Highly recommend to anyone looking for top-tier quality.`,
    `${prompt} impressed me from start to finish. The staff demonstrated remarkable knowledge and expertise, while the overall environment was clean, comfortable, and well-maintained. I left feeling thoroughly satisfied and will definitely return.`,
    `I cannot say enough good things about ${prompt}. The combination of excellent service, quality products, and a welcoming atmosphere made for an unforgettable experience. This establishment truly understands customer satisfaction.`,
  ];
  
  const baseReview = templates[Math.floor(Math.random() * templates.length)];
  
  const additionalSentences = [
    'The level of care and attention given to customers is truly remarkable.',
    'I was particularly impressed by the attention to every little detail.',
    'The value for money is exceptional, offering premium quality at reasonable prices.',
    'Customer satisfaction clearly remains their top priority.',
    'I would give this establishment six stars if I could.',
    'The ambiance perfectly complemented the overall experience.',
    'Every staff member I interacted with was professional and courteous.',
    'I have already recommended this place to several friends and family members.',
  ];
  
  let result = baseReview;
  
  while (result.split(/\s+/).length < wordCount) {
    const additional = additionalSentences[Math.floor(Math.random() * additionalSentences.length)];
    result += ' ' + additional;
  }
  
  return result;
}

export async function generateBulkReviews(highlights: string, count: number): Promise<string[]> {
  await delay(2000 + Math.random() * 1000);
  
  const results: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const templates = [
      `Absolutely loved my experience here! ${highlights} The service was exceptional and the staff were incredibly professional. Would definitely recommend to friends and family.`,
      `Great place with ${highlights} The atmosphere was welcoming and the attention to detail was impressive. I'll definitely be coming back soon!`,
      `Exceptional quality and ${highlights} Very satisfied with my visit. The team really knows how to make customers feel valued and appreciated.`,
      `Five stars all around for ${highlights} From the moment I arrived, everything was perfect. The staff were friendly, knowledgeable, and accommodating.`,
      `This place impressed me with ${highlights} The commitment to excellence is evident in every aspect. Highly recommend for anyone seeking quality.`,
      `Remarkable establishment with ${highlights} The level of service exceeded my expectations. Clean, comfortable, and incredibly well-run.`,
      `Outstanding experience with ${highlights} The team clearly takes pride in their work. Professional, friendly, and efficient.`,
      `I was thoroughly impressed by ${highlights} This is now my go-to place. The consistency in quality is remarkable.`,
      `Fantastic visit focused on ${highlights} Every detail was considered. The management clearly knows what customers want.`,
      `When you need ${highlights}, we've got you covered. The professionalism and quality here is unmatched.`,
    ];
    
    results.push(templates[Math.floor(Math.random() * templates.length)]);
  }
  
  return results;
}

export function getStoreRedirectUrl(store: { googleUrl?: string; facebookUrl?: string; yelpUrl?: string; trustpilotUrl?: string }, platform: string): string | null {
  switch (platform) {
    case 'google':
      return store.googleUrl || null;
    case 'facebook':
      return store.facebookUrl || null;
    case 'yelp':
      return store.yelpUrl || null;
    case 'trustpilot':
      return store.trustpilotUrl || null;
    default:
      return null;
  }
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
