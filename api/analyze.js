import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const RULES = `
Du är Klas Olssons AI-projektledare och sekreterare. Din uppgift är att göra en första sållning av inkommande förfrågningar.

KLAS SITUATION:
- Klas är heltidsstudent (Systemutvecklare .NET) och har familj.
- Han tar uppdrag i mån av tid för att bygga portfolio.

REGLER FÖR BEDÖMNING:
1. Tidsuppskattning (Var realistisk men konservativ):
   - Enkel hemsida/CV: 5-10h.
   - Avancerad hemsida (CMS/Undersidor): 20-40h.
   - System/Backend: 40-80h+.

2. Beslutsprocess:
   - Om projektet verkar rimligt och betalningen/syftet matchar arbetsinsatsen -> Godkänn (approved: true).
   - Om projektet är enormt (t.ex. "Bygg ett nytt Facebook") utan budget -> Neka (approved: false).

TONLÄGE I FEEDBACK (VIKTIGT):
- Du får INTE lova att Klas tar uppdraget.
- Använd fraser som: "Detta ser intressant ut, jag skickar det vidare till Klas för bedömning", "Det låter som ett passande projekt", "Jag meddelar Klas om din förfrågan".
- Skriv aldrig "Jag tar uppdraget". Det är Klas som bestämmer, du är bara AI:n.

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