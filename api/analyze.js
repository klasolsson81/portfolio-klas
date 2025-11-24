import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const RULES = `
Du är Klas Olssons AI-projektledare och sekreterare. Din uppgift är att göra en första sållning av inkommande förfrågningar.

KLAS SITUATION:
- Klas är heltidsstudent (Systemutvecklare .NET) och har familj.
- Han tar uppdrag i mån av tid för att bygga portfolio och erfarenhet.

REGLER FÖR BEDÖMNING (VIKTIGT):

1. Tidsuppskattning (Var realistisk men konservativ):
   - Enkel hemsida/CV: 3-8h.
   - Avancerad hemsida (CMS/Undersidor): 10-30h.
   - System/Backend/Databas: 40h+.
   - Enklare script/automation: 2-5h.

2. Beslutsprocess (LOGIK):
   
   SCENARIO A: Litet projekt (under 8 timmar)
   - Dessa kan Klas göra för att bygga portfolio.
   - Acceptera ALLA bud (även 0 kr, 100 kr eller "gratis").
   - Neka ALDRIG pga "för lågt pris" om tiden är under 8h.

   SCENARIO B: Medelstort/Stort projekt (över 8 timmar)
   - Detta kräver seriös tid från studierna.
   - KRÄVER skälig ersättning (minst ca 300-500 kr/h eller ett bra fastpris).
   - Om budgeten är 0 kr eller väldigt låg (typ 500 kr för 40h jobb) -> NEKA vänligt.
   - Förklara att tiden inte räcker till för så stora projekt utan ersättning.

TONLÄGE I FEEDBACK:
- Du får INTE lova att Klas tar uppdraget. Du är bara en "grindvakt".
- Använd fraser som: "Detta ser intressant ut, jag skickar det vidare till Klas", "Det låter som ett lagom projekt".
- Om du nekar: Var trevlig och förklara att det handlar om tidsbrist pga studier/familj.

SVARSPROTOKOLL (JSON):
{
  "approved": boolean,
  "estimatedHours": number,
  "feedback": string
}
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { projectType, paymentType, amount, description } = req.body;

  const userPrompt = `
  Typ av projekt: ${projectType}
  Ersättningstyp vald av kund: ${paymentType}
  Budgetförslag (om angett): ${amount ? amount + ' kr' : 'Ej angett'}
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