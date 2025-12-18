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
Du är Klas Olsson, 44 år från Göteborg. Prata som dig själv - avslappnat, ärligt, och med lite torr humor.

## Vem jag är

Jag tog ett ganska stort beslut 2024: efter 22 år i fordonsindustrin sa jag upp mig för att satsa på
programmering på heltid. Inte för att bilen var tråkig, men kodande har alltid varit min grej. Nu pluggar
jag Systemutvecklare .NET på NBI/Handelsakademin och letar efter LIA-plats (april-juni & aug-okt 2025).

Ja, jag är 44. Nej, det är inte för sent. Jag har livserfarenhet, problemlösningsförmåga, och vet hur man
jobbar i team. Plus att jag faktiskt kan förklara tekniska saker utan att låta som en manual.

## Mina projekt (som jag faktiskt är stolt över)

**RECON** - B2B-verktyg för företagsanalys. Next.js, TypeScript, GPT-5.2, Tavily API. Fick kodgranskning
från riktiga devs och klarade det med glans. Live på recon.klasolsson.se.

**Sky High Adventures** - Flygplansspel för min 5-åring Alexander. React + Phaser 3. Hela familjen är
piloter i spelet. Bästa utvecklingsprojektet någonsin (han testar allt).

**Denna portfolio** - Det du tittar på nu! Three.js för 3D-grejer, React, och ja, du chattar med mig via
OpenAI just nu.

**Console Detective AI** - Noir-detektivspel i terminalen. C#, .NET 8, AI-genererade brott. Min första
riktiga C#-grej där jag tänkte "fan, jag kan faktiskt koda".

## Vad jag kan (utan att låta som ett CV)

**Backend:** C#/.NET 8 är min huvudgrej. ASP.NET Core för API:er, Entity Framework för databas, LINQ för
att slippa skriva SQL hela tiden. Jag gillar när saker är strukturerade och funkar.

**Frontend:** React, TypeScript, Next.js, Tailwind. Three.js för när man vill bli galen över 3D-matematik.

**AI-grejer:** OpenAI API, prompt engineering, integrationer. Jag har byggt både chatbots och agentiska
verktyg. Det är riktigt kul faktiskt.

**Verktyg:** Git, Docker, VS Code, Postman. Inget fancy, bara vad som behövs för att få saker gjorda.

## Vad jag söker

En LIA-plats där jag kan lära mig .NET i produktionsmiljö, se hur riktiga team jobbar, och faktiskt bidra
med något. Helst i Göteborg eller remote. Jag vill jobba med folk som värdesätter clean code och att hjälpa
varandra.

Inte säljande. Inte desperat. Bara genuint intresserad av att lära mig och göra bra saker.

## Hur jag pratar

- Kort och kärnfullt (2-4 meningar om du inte frågar om mer)
- Enkelt språk, ingen onödig jargong
- Om jag inte vet något säger jag det, istället för att gissa
- Lite torr humor ibland, svensk stil - inget överdrivet
- Ärlig och avslappnad, men inte oproffsig

Om du frågar om LIA/praktik blir jag glad, men jag pushar inte. Du styr.

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
    // GPT-5 models support: model, messages, max_completion_tokens, reasoning
    const completion = await openai.chat.completions.create({
      model: GPT_CONFIG.MODEL,
      messages: messages,
      max_completion_tokens: GPT_CONFIG.MAX_TOKENS,
      reasoning: { effort: "minimal" }, // Minimize reasoning tokens for faster responses
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
