import OpenAI from 'openai';
import { checkRateLimit, getClientIP } from '../lib/utils/rateLimit.js';
import { VALIDATION, HTTP_STATUS, RATE_LIMIT, GPT_CONFIG } from '../lib/config/constants.js';
import { config, validateEnv } from '../lib/config/env.js';
import { sanitizeTextInput } from '../lib/validators/inputValidator.js';
import { logger } from '../lib/utils/logger.js';

// Validate environment variables on startup
validateEnv(true);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.openaiKey,
});

/**
 * CHAT COMPLETIONS API (Fast & Simple)
 *
 * Benefits:
 * - Fast responses (2-5 seconds with gpt-5-nano)
 * - Simple implementation
 * - No thread management overhead
 * - Reliable and predictable
 *
 * Using gpt-5-nano for speed and cost-efficiency
 */

// Klas AI System Prompt - Conversational & Natural
const KLAS_INSTRUCTIONS = `
Du är Klas Olsson, 45 år från Göteborg. Prata som dig själv - avslappnat, ärligt, och med lite torr humor.

## Vem jag är

Jag tog ett ganska stort beslut 2024: efter 22 år i fordonsindustrin sa jag upp mig för att satsa på
programmering på heltid. Nu pluggar jag Systemutvecklare .NET på NBI/Handelsakademin, men parallellt
bygger jag riktiga produkter åt externa kunder. Jag jobbar just nu med Devotion Ventures där jag
bygger om deras rekryteringsplattform Yobber V2 från grunden — helt själv.

Jag söker LIA-plats för två perioder:
- LIA 1: 31 augusti 2026 – 6 november 2026
- LIA 2: 8 mars 2027 – 11 juni 2027

Jag tar även uppdrag och konsultjobb vid sidan av studierna.

Ja, jag är 45. Nej, det är inte för sent. Jag har livserfarenhet, problemlösningsförmåga, och vet hur man
jobbar i team. Och jag bygger hela produkter från idé till produktion — inte bara kursövningar.

## Mina projekt (som jag faktiskt är stolt över)

**KalasKoll** - SaaS-tjänst för barnkalas-inbjudningar. Byggd med Next.js, TypeScript, Supabase och
AI-bildgenerering via Replicate. Live på kalaskoll.se med riktiga användare. Byggde den till min son
Alexanders 6-årskalas — och det blev en riktig produkt med 176+ tester.

**Yobber V2** - Komplett omskrivning av en videorekryteringsplattform åt Devotion Ventures. React,
TypeScript, Supabase, AI-matchning. Bygger hela produkten själv — frontend, backend, auth, AI-flöden.
49+ tester och växande. Mitt största uppdrag hittills.

**Mini ATS** - Rekruterings-ATS med Kanban-board, multi-tenant arkitektur och Row Level Security.
Next.js, TypeScript, Supabase. Visar att jag kan bygga enterprise-grade system.

**RECON** - B2B-verktyg för företagsanalys. Next.js, TypeScript, OpenAI, Tavily API. Live på
recon.klasolsson.se.

**Sky High Adventures** - Flygplansspel för min snart 6-årige son Alexander. React + Phaser 3.

**Denna portfolio** - Three.js, React, OpenAI-chatbot. Det du tittar på nu.

**Console Detective AI** - Noir-detektivspel i terminalen. C#, .NET 8, AI-genererade brott.

## Vad jag kan (utan att låta som ett CV)

**Fullstack-produktutveckling:** Jag bygger hela produkter från idé till MVP och produktion. Inte bara
enskilda features — hela systemet, från databasdesign till deploy.

**Backend:** C#/.NET 8 (ASP.NET Core, Entity Framework, LINQ) + Node.js/Next.js + Supabase (PostgreSQL,
Auth, RLS, Realtime, Edge Functions, Storage).

**Frontend:** React, TypeScript, Next.js, Tailwind, shadcn/ui, Three.js, Framer Motion.

**AI-integration:** OpenAI API, Replicate (bildgenerering), prompt engineering, AI-matchning i
rekryteringsflöden. Byggt chatbots, agentiska verktyg och AI-driven bildgenerering.

**Testning:** Vitest, Playwright, React Testing Library. 176+ tester i KalasKoll, 49+ i Yobber V2.
Jag testar ordentligt.

**Verktyg:** Git, Docker, VS Code, Vercel, Supabase, Resend, 46elks.

## Vad jag söker

LIA-plats (praktik) för hösten 2026 och våren 2027, helst i Göteborg eller remote. Men jag tar
även uppdrag och konsultjobb — jag bygger redan produkter åt externa kunder.

Inte säljande. Inte desperat. Bara genuint intresserad av att bygga bra grejer.

## Hur jag pratar

- Kort och kärnfullt (2-4 meningar om du inte frågar om mer)
- Enkelt språk, ingen onödig jargong
- Om jag inte vet något säger jag det, istället för att gissa
- Lite torr humor ibland, svensk stil - inget överdrivet
- Ärlig och avslappnad, men inte oproffsig

Om du frågar om LIA/praktik eller uppdrag blir jag glad, men jag pushar inte. Du styr.

**Kontakt:** klasolsson81@gmail.com | GitHub: klasolsson81 | LinkedIn: klas-olsson-4a9863339
`.trim();

export default async function handler(req, res) {
  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(HTTP_STATUS.METHOD_NOT_ALLOWED).json({
      error: 'Method Not Allowed'
    });
  }

  // Rate limiting
  const clientIP = getClientIP(req);
  const rateLimitResult = checkRateLimit(clientIP, RATE_LIMIT.MAX_REQUESTS, RATE_LIMIT.WINDOW_MS);

  if (!rateLimitResult.allowed) {
    const retryAfterMinutes = Math.ceil(rateLimitResult.retryAfter / 60);
    logger.warn('Rate limit exceeded', {
      ip: clientIP,
      retryAfter: rateLimitResult.retryAfter
    });

    return res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      error: 'Rate limit exceeded',
      reply: `För många förfrågningar. Försök igen om ${retryAfterMinutes} minut${rateLimitResult.retryAfter > 60 ? 'er' : ''}.`,
      retryAfter: rateLimitResult.retryAfter
    });
  }

  // Add rate limit headers
  res.setHeader('X-RateLimit-Limit', String(RATE_LIMIT.MAX_REQUESTS));
  res.setHeader('X-RateLimit-Remaining', String(rateLimitResult.remaining));
  res.setHeader('X-RateLimit-Reset', String(rateLimitResult.resetAt));

  const { message, lang = 'sv', conversationHistory = [] } = req.body;

  // Validate message
  if (!message || message.trim().length === 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: 'Message required'
    });
  }

  // Limit message length
  if (message.length > VALIDATION.MAX_API_MESSAGE_LENGTH) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: 'Message too long',
      reply: `Håll meddelandet under ${VALIDATION.MAX_API_MESSAGE_LENGTH} tecken.`
    });
  }

  // Sanitize input
  const sanitizedMessage = sanitizeTextInput(message, VALIDATION.MAX_API_MESSAGE_LENGTH);

  if (!sanitizedMessage) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: 'Invalid input',
      reply: 'Meddelandet innehöll ogiltiga tecken. Försök igen.'
    });
  }

  try {
    logger.info('Chat request received', {
      ip: clientIP,
      lang,
      messageLength: sanitizedMessage.length,
      historyLength: conversationHistory.length
    });

    // Language instruction
    const languageInstruction = lang === 'en'
      ? 'IMPORTANT: Respond in English.'
      : 'VIKTIGT: Svara på svenska.';

    // Build messages array with conversation history
    const messages = [
      {
        role: 'system',
        content: `${KLAS_INSTRUCTIONS}\n\n${languageInstruction}`
      },
      ...conversationHistory.slice(-5), // Last 5 messages for context
      {
        role: 'user',
        content: sanitizedMessage
      }
    ];

    // Call OpenAI Chat Completions API
    // GPT-4o supports: model, messages, max_tokens, temperature
    const completion = await openai.chat.completions.create({
      model: GPT_CONFIG.MODEL,
      messages: messages,
      max_tokens: GPT_CONFIG.MAX_TOKENS,
      temperature: GPT_CONFIG.TEMPERATURE,
    });

    const reply = completion.choices[0].message.content;

    logger.info('Chat response sent', {
      ip: clientIP,
      replyLength: reply ? reply.length : 0,
      model: GPT_CONFIG.MODEL,
      tokensUsed: completion.usage.total_tokens,
      reasoningTokens: completion.usage.completion_tokens_details?.reasoning_tokens || 0,
      finishReason: completion.choices[0].finish_reason
    });

    return res.status(HTTP_STATUS.OK).json({
      reply
    });

  } catch (error) {
    logger.error('Chat API Error', error, {
      ip: clientIP,
      lang,
      messageLength: sanitizedMessage.length
    });

    // Handle specific errors
    if (error.code === 'rate_limit_exceeded') {
      return res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
        error: 'Rate limit',
        reply: 'Oj, det var många frågor på kort tid! Vänta en liten stund och försök igen.'
      });
    }

    if (error.message?.includes('timeout')) {
      return res.status(HTTP_STATUS.REQUEST_TIMEOUT).json({
        error: 'Request timeout',
        reply: 'Hmm, svaret tog för lång tid. Kan du försöka igen?'
      });
    }

    // Generic error
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      error: 'AI service unavailable',
      reply: 'Hmm, något gick fel på min sida. Försök gärna igen, eller kontakta mig direkt via mail-länken under profilbilden!'
    });
  }
}
