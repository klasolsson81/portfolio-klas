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
      // SEO: Inkluderar yrkesroll + stad i första meningen för lokal relevans
      intro1: "Erfaren .NET-utvecklare i Göteborg med passion för C# och modern arkitektur. Just nu satsar jag helhjärtat på att bygga framtidens digitala lösningar genom skalbar kod och stabil systemdesign.",
      // SEO: Väver in "IT-konsult", "backend" och "AI-integration"
      intro2: "I min roll som backend-utvecklare och IT-konsult kombinerar jag djup teknisk expertis med modern AI-utveckling. Jag använder AI som en strategisk hävstång för att effektivisera komplexa utvecklingsprojekt och leverera högkvalitativa system som gör skillnad.",
      stackTitle: "Tech Stack",
      factsTitle: "Personligt",
      facts: { age: "Ålder", city: "Bor i", lang: "Språk", family: "Familj" },
      factValues: { city: "Göteborg", lang: "Svenska / Engelska", family: "Gift familjefar" }
    },
    projects: { more: "Fler projekt finns på min GitHub!", watch: "Se Trailer", details: "Djupdykning" }
  },
  en: {
    role: "IT Consultant & System Developer",
    nav: {
      about: "About",
      chat: "AI Chat",
      projects: "Projects",
      journey: "Journey",
      hire: "Hire Me",
      cv: "CV"
    },
    titles: {
      whoami: "Who am I?",
      ai: "Ask me anything",
      projects: "Projects",
      journey: "My Journey",
      hire: "Hire Me"
    },
    about: {
      // SEO: English keywords for international recruiters
      intro1: "Experienced .NET Developer in Gothenburg with a passion for C# and software architecture. I am currently dedicated to building next-generation digital solutions through robust code and scalable design.",
      // SEO: High-value terms like "IT consultant", "Backend" and "AI integration"
      intro2: "As a backend developer and IT consultant, I bridge the gap between traditional system architecture and innovative AI integration. I leverage AI as a strategic catalyst to drive efficiency and deliver high-performance software engineering projects.",
      stackTitle: "Tech Stack",
      factsTitle: "Personal",
      facts: { age: "Age", city: "Location", lang: "Languages", family: "Family" },
      factValues: { city: "Gothenburg", lang: "Swedish / English", family: "Married, father" }
    },
    projects: { more: "More projects on my GitHub!", watch: "Watch Trailer", details: "Deep Dive" }
  }
};

export function calculateAge(birthday) {
  const ageDifMs = Date.now() - new Date(birthday).getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}