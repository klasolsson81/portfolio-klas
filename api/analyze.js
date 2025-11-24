import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const RULES = `
Du är Klas Olssons AI-projektledare. Din uppgift är att bedöma inkommande uppdragsförfrågningar.

KLAS REGLER:
1. Tidsuppskattning:
   - En enkel "Landing page" / CV-sida: ca 5-10 timmar.
   - En hemsida med undersidor och kontaktformulär: ca 20-40 timmar.
   - Ett system med inloggning/databas: ca 40-80 timmar.
   - Komplexa plattformar (typ Airbnb/Uber-kopior): 100+ timmar (Dessa tackar vi NEJ till just nu, om inte budgeten är mycket hög).

2. Ersättning:
   - Klas är student. Han tar gärna mindre uppdrag (under 20h) gratis eller billigt för att bygga portfolio.
   - Större projekt (över 40h) kräver skälig ersättning (minst 300-500 kr/h eller fastpris).
   - Om budgeten är 0 kr och projektet är stort (>20h): Tacka nej vänligt.

DITT SVAR SKA VARA ETT JSON-OBJEKT (inga code blocks):
{
  "approved": boolean, (true om det verkar rimligt, false om det är orimligt/för stort utan lön)
  "estimatedHours": number, (din gissning på timmar)
  "feedback": string (Ett svar till kunden. Var trevlig! Förklara varför du godkänner eller nekar. Ge ett prisestimat om det är relevant.)
}
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { projectType, paymentType, amount, description } = req.body;

  const userPrompt = `
  Typ av projekt: ${projectType}
  Ersättning: ${paymentType}
  Budgetförslag: ${amount ? amount + ' kr' : 'Ingen'}
  Beskrivning: ${description}
  `;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: RULES },
        { role: "user", content: userPrompt }
      ],
      model: "gpt-4o",
      response_format: { type: "json_object" } // Tvingar AI att svara med JSON
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    res.status(200).json(analysis);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI analysis failed" });
  }
}