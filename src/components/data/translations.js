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
      intro1: "Driven Systemutvecklare med fokus på .NET. Just nu tjänstledig för att satsa helhjärtat på kod och arkitektur.",
      intro2: "Jag kombinerar djup .NET-kunskap med modern AI-utveckling. Jag är inte rädd för nya språk och använder AI för att snabbt sätta mig in i nya tekniker vid behov.",
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
      intro1: "Driven System Developer focusing on .NET. Currently on leave of absence to fully commit to code and architecture.",
      intro2: "Combining deep .NET knowledge with modern AI development. I'm adaptable and leverage AI to rapidly master new languages or frameworks when projects require it.",
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
