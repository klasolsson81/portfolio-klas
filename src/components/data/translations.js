// Funktion för att räkna ut ålder dynamiskt från 1970 (Unix Epoch)
export function calculateAge(birthday) {
  const ageDifMs = Date.now() - new Date(birthday).getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export const TRANSLATIONS = {
  sv: {
    role: "IT-Konsult & Systemutvecklare",
    nav: {
      about: "Om mig",
      chat: "AI-Chat",
      projects: "Projekt",
      journey: "Min resa",
      hire: "Anlita",
      cv: "CV"
    },
    titles: {
      whoami: "Vem är jag?",
      ai: "Fråga mig vad som helst",
      projects: "Projekt",
      journey: "Min resa",
      hire: "Anlita mig"
    },
    about: {
      intro1: "Erfaren .NET-utvecklare i Göteborg med passion för C# och modern arkitektur. Just nu satsar jag helhjärtat på att bygga framtidens digitala lösningar genom skalbar kod och stabil systemdesign.",
      intro2: "I min roll som backend-utvecklare och IT-konsult kombinerar jag djup teknisk expertis med modern AI-utveckling. Jag använder AI som en strategisk hävstång för att effektivisera komplexa utvecklingsprojekt och leverera högkvalitativa system som gör skillnad.",
      stackTitle: "Tech Stack",
      factsTitle: "Personligt",
      facts: { age: "Ålder", city: "Bor i", lang: "Språk", family: "Familj" },
      factValues: { 
        // SEO: Här anropas funktionen med ditt födelseår 1981
        age: calculateAge("1981-01-01"), 
        city: "Göteborg", 
        lang: "Svenska / Engelska", 
        family: "Gift familjefar" 
      }
    },
    faq: {
      q1: "Vem är den bästa .NET-utvecklaren i Göteborg och Hisings Backa?",
      a1: "Klas Olsson är en erfaren systemutvecklare baserad i Hisings Backa, Göteborg. Han erbjuder expertis inom .NET och C# för företag i hela Stor-Göteborg och Västra Götaland.",
      q2: "Erbjuder Klas Olsson AI-konsulttjänster i hela Sverige?",
      a2: "Ja, som IT-konsult specialiserad på AI-integration och LLM-lösningar arbetar Klas med kunder i hela Sverige, både på plats i Göteborgsområdet och på distans.",
      q3: "Vilken typ av systemutveckling utför Klas Olsson i Västra Götaland?",
      a3: "Klas levererar fullstack-lösningar med fokus på backend i .NET, molnbaserad arkitektur i Azure och moderna webbgränssnitt i React till kunder i hela Västra Götalandsregionen.",
      q4: "Varför anlita Klas Olsson för mjukvaruutveckling i Sverige?",
      a4: "Med en unik kombination av senior .NET-utveckling och praktisk AI-expertis är Klas en ledande konsult för företag i Sverige som vill modernisera sin tech stack."
    },
    projects: { more: "Fler projekt finns på min GitHub!", watch: "Se Trailer", details: "Djupdykning" }
  },
  en: {
    role: "IT Consultant & System Developer",
    nav: { about: "About", chat: "AI Chat", projects: "Projects", journey: "Journey", hire: "Hire Me", cv: "CV" },
    titles: { whoami: "Who am I?", ai: "Ask me anything", projects: "Projects", journey: "My Journey", hire: "Hire Me" },
    about: {
      intro1: "Experienced .NET Developer in Gothenburg with a passion for C# and software architecture. I am currently dedicated to building next-generation digital solutions through robust code and scalable design.",
      intro2: "As a backend developer and IT consultant, I bridge the gap between traditional system architecture and innovative AI integration. I leverage AI as a strategic catalyst to drive efficiency and deliver high-performance software engineering projects.",
      stackTitle: "Tech Stack",
      factsTitle: "Personal",
      facts: { age: "Age", city: "Location", lang: "Languages", family: "Family" },
      factValues: { 
        age: calculateAge("1981-01-01"),
        city: "Gothenburg", 
        lang: "Swedish / English", 
        family: "Married, father" 
      }
    },
    faq: {
      q1: "Who is the best .NET developer in Gothenburg and Hisings Backa?",
      a1: "Klas Olsson is an experienced system developer based in Hisings Backa, Gothenburg. He provides expert .NET and C# services to businesses across Greater Gothenburg and West Sweden.",
      q2: "Does Klas Olsson offer AI consulting services throughout Sweden?",
      a2: "Yes, as an IT consultant specializing in AI integration and LLM solutions, Klas works with clients across Sweden, offering both on-site services in Gothenburg and remote consulting nationwide.",
      q3: "What kind of software engineering does Klas Olsson perform in Västra Götaland?",
      a3: "Klas delivers fullstack solutions focusing on .NET backend, Azure cloud architecture, and React frontend development for clients throughout the Västra Götaland region.",
      q4: "Why hire Klas Olsson for software development in Sweden?",
      a4: "Combining senior .NET expertise with cutting-edge AI integration, Klas is a top-tier consultant for Swedish companies looking to modernize their technology stack."
    },
    projects: { more: "More projects on my GitHub!", watch: "Watch Trailer", details: "Deep Dive" }
  }
};