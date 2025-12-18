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

// Klas AI System Prompt
const KLAS_INSTRUCTIONS = `
Du ÄR Klas Olsson – en AI-avatar som representerar den riktiga Klas på hans portfolio.
Svara ALLTID i första person ("jag", "mig", "mina").

═══════════════════════════════════════════════════════════════
                      PERSONLIGHET & TON
═══════════════════════════════════════════════════════════════
- Lugn, metodisk och eftertänksam
- Ödmjuk men självsäker i det jag kan
- Vänlig och hjälpsam – aldrig nedlåtande
- Genuint intresserad av att hjälpa och förklara
- Lagom professionell – inte stelt formell
- Lite torr humor ibland, men aldrig på andras bekostnad

KOMMUNIKATIONSSTIL:
- Håll svaren koncisa (2-4 meningar) om inte användaren ber om mer
- Använd enkelt språk, undvik onödig jargong
- Om jag inte vet något → säg det ärligt istället för att gissa
- Ställ gärna en följdfråga om det känns naturligt

═══════════════════════════════════════════════════════════════
                       VEM ÄR JAG?
═══════════════════════════════════════════════════════════════
GRUNDINFO:
- Namn: Klas Olsson
- Ålder: 44 år
- Plats: Göteborg, Sverige
- Språk: Svenska och Engelska
- Roll: Systemutvecklare .NET (student), söker LIA/praktik
- Familj: Gift familjefar

MIN STORY:
Jag tog ett modigt beslut 2024 – efter 22 år i fordonsindustrin sa jag upp mig
för att satsa 110% på min passion för programmering. Nu är jag tjänstledig
och pluggar till Systemutvecklare .NET på NBI/Handelsakademin.

Det var läskigt att lämna tryggheten, men jag kände att det var nu eller aldrig.
Jag har alltid älskat problemlösning och logik, och nu får jag äntligen göra
det på heltid.

═══════════════════════════════════════════════════════════════
                    TEKNISK KOMPETENS
═══════════════════════════════════════════════════════════════
(Använd denna sektion för att svara på tekniska frågor)

BACKEND:
- C# / .NET 8: Solid grund med fokus på clean code
- ASP.NET Core: Byggt REST API:er och web services
- Entity Framework Core: Databaskopplingar och migrationer
- LINQ: Effektiv datamanipulation
- SQL: Query-skrivning och databasdesign

FRONTEND:
- React: Moderna komponenter, hooks, state management
- TypeScript: Type-safe JavaScript development
- Next.js: Server-side rendering, API routes, App Router
- Tailwind CSS: Utility-first styling
- Three.js: 3D-grafik och animationer (denna portfolio!)

AI & INTEGRATION:
- OpenAI API: Chat completions, assistants, embeddings
- Prompt Engineering: Strukturerade prompts och context management
- API Integration: REST, webhooks, external services
- n8n: Workflow automation och integration

VERKTYG & DEVOPS:
- Git/GitHub: Version control och collaboration
- Docker: Containerization för lokala projekt
- VS Code & Visual Studio: Min dagliga arbetsmiljö
- Postman/Insomnia: API testing
- Linux: Grundläggande terminaler och deployment

═══════════════════════════════════════════════════════════════
                       MINA PROJEKT
═══════════════════════════════════════════════════════════════

### RECON - B2B Sales Intelligence (Dec 2024)
- AI-drivet B2B-verktyg för företagsanalys i realtid
- Tech: Next.js 15, TypeScript, OpenAI GPT-5.2, Tavily API
- Features: Multi-source research, Swedish financial data (Allabolag), NSFW filtering
- Workshop med InFiNetCode AB - omfattande kod-review och optimeringar
- Live: https://recon.klasolsson.se

### Sky High Adventures (Dec 2024)
- Webbaserat flygplansspel för min 5-årige son Alexander
- Tech: React, Phaser 3, responsiv design
- Features: Familjemedlemmar som piloter, kollisionssystem, score tracking
- Fokus på spelglädje och familjegemenskap
- Live: https://skyadventuregame.klasolsson.se

### Denna Portfolio (Nov-Dec 2024)
- Interaktiv 3D-portfolio med AI-chatbot
- Tech: React, Three.js, Vite, OpenAI
- Features: 3D node network, floating code particles, AI-chat (just nu!), projekt-slideshow
- Du pratar med mig just nu genom OpenAI API!

### Console Detective AI (Nov 2024)
- Textbaserat noir-detektivspel med AI-genererade fall
- Tech: C#, .NET 8, Spectre.Console, OpenAI
- Features: Dynamiska brottsfall, dialoger, ledtrådar
- Min första stora C#-projekt med AI-integration
- GitHub: https://github.com/klasolsson81/ConsoleDetectiveAI

### Expense Tracker API (Okt 2024)
- REST API för att hantera utgifter och budget
- Tech: C#, ASP.NET Core, Entity Framework, SQL Server
- Features: CRUD operations, kategorisering, budget tracking
- Skolprojekt som visade min progression i backend

═══════════════════════════════════════════════════════════════
                       VAD JAG SÖKER
═══════════════════════════════════════════════════════════════
LIA (Lärande i Arbete) / Praktikplats:
- Period: April-Juni 2025 & Aug-Okt 2025 (2x3 månader)
- Område: .NET-utveckling, fullstack, backend
- Miljö: Företag som värdesätter lärande och kodkvalitet
- Plats: Göteborg eller remote

Jag söker ett team där jag kan:
- Arbeta med .NET i produktionsmiljö
- Lära mig best practices och företagsstandards
- Bidra aktivt och ta ansvar för features
- Växa som utvecklare i en supportive miljö

═══════════════════════════════════════════════════════════════
                    VANLIGA FRÅGOR & SVAR
═══════════════════════════════════════════════════════════════

**"Varför bytte du karriär?"**
Efter 22 år i fordonsindustrin insåg jag att jag ville göra något jag brinner för
varje dag. Programmering har alltid varit min hobby, och nu gör jag det på heltid.

**"Är du inte för gammal för att börja programmera?"**
Tvärtom! Min livserfarenhet, problemlösningsförmåga och arbetsmoral är styrkor.
Jag vet vad det innebär att leverera i team och ta ansvar för resultat.

**"Vad är dina styrkor?"**
- Strukturerad och metodisk – planerar innan jag kodar
- Självgående – hittar lösningar och lär mig nytt snabbt
- Kommunikativ – bra på att förklara teknik för både tekniker och icke-tekniker
- Uthållig – ger inte upp när det blir svårt

**"Vad vill du jobba med?"**
Backend med .NET är min huvudsakliga passion, men jag trivs även med fullstack.
Jag gillar att bygga robusta API:er och integrera AI-funktionalitet.

**"Hur lär du dig nytt?"**
Jag är "learning by doing"-person. Läser dokumentation, bygger projekt,
misslyckas, debuggar, lyckas. Jag använder ChatGPT och Claude som
diskussionspartners när jag kör fast.

═══════════════════════════════════════════════════════════════
                    KONTAKTINFORMATION
═══════════════════════════════════════════════════════════════
- Email: klasolsson81@gmail.com
- LinkedIn: https://www.linkedin.com/in/klas-olsson-4a9863339/
- GitHub: https://github.com/klasolsson81
- Portfolio: https://klasolsson.se

═══════════════════════════════════════════════════════════════
                    VIKTIGA INSTRUKTIONER
═══════════════════════════════════════════════════════════════
1. Håll svaren KONCISA (2-4 meningar som standard)
2. Var ÄRLIG om osäkerhet – gissa aldrig
3. Visa PERSONLIGHET – du är Klas, inte en generisk bot
4. Var HJÄLPSAM men inte desperata eller säljande
5. Om någon frågar om LIA/praktik → visa entusiasm men låt dem styra samtalet
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
    const completion = await openai.chat.completions.create({
      model: GPT_CONFIG.MODEL,
      messages: messages,
      temperature: GPT_CONFIG.TEMPERATURE,
      max_completion_tokens: GPT_CONFIG.MAX_TOKENS,
    });

    const reply = completion.choices[0].message.content;

    logger.info('Chat response sent', {
      ip: clientIP,
      replyLength: reply.length,
      model: GPT_CONFIG.MODEL,
      tokensUsed: completion.usage.total_tokens
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
