import React from 'react';

// VIDEO
import detectiveVideo from '../../assets/video.mp4';

// DETECTIVE IMAGES
import detectiveImg1 from '../../assets/detective-1.png';
import detectiveImg2 from '../../assets/detective-2.png';
import detectiveImg3 from '../../assets/detective-3.png';

// FITNESS IMAGES
import fitnessImg1 from '../../assets/fitness-1.png';
import fitnessImg2 from '../../assets/fitness-2.png';
import fitnessImg3 from '../../assets/fitness-3.png';
import fitnessImg4 from '../../assets/fitness-4.png';

export const PROJECT_SLIDES = {
  detective: [
    {
      title: "Projektöversikt",
      type: "intro",
      content: <p><strong>Console Detective AI</strong> är ett textbaserat noir-detektivspel där ingen spelomgång är den andra lik. Genom att integrera OpenAI skapas brottsfall, dialoger och ledtrådar dynamiskt i realtid.</p>,
      image: detectiveImg2
    },
    {
      title: "Utmaning: Att blanda logik och UI",
      type: "problem",
      content: <p>Detta var första gången jag använde biblioteket <strong>Spectre.Console</strong>. Jag gjorde misstaget att först skriva all spellogik för vanlig konsol, och sedan försöka "tvinga in" det snygga UI:t efteråt. Det ledde till att jag fick skriva om stora delar av koden.</p>,
      image: detectiveImg1
    },
    {
      title: "Spelmekanik & AI",
      type: "solution",
      content: <p>För att få AI:n att hålla sig till "sanningen" i mordgåtan skapade jag en strikt <code>CaseContext</code> som skickas med som en dold System Prompt. Det gör att AI:n vet vem mördaren är, men aldrig avslöjar det för tidigt.</p>,
      image: detectiveImg3
    },
    {
      title: "Lärdom: Arkitektur är allt",
      type: "learning",
      content: <p>Resultatet blev att UI-kod och logik blandades mer än jag hade velat. Om jag gjorde om det idag hade jag separerat det tydligare från start (t.ex. med MVC-mönster) för att hålla <code>Spectre</code>-koden helt isolerad.</p>
    },
    {
      title: "Teknik: LINQ & C#",
      type: "code",
      content: <p>Projektet gav mig djupare förståelse för C#-grunderna, särskilt <strong>LINQ</strong> för att hantera listor av ledtrådar och objektorientering för att bygga upp spelets värld.</p>
    }
  ],
  fitness: [
    {
      title: "Projektöversikt",
      type: "intro",
      content: <p><strong>Fitness Progress Tracker</strong> var ett omfattande grupparbete där vi byggde ett system för PTs och klienter. Jag axlade rollen som <strong>Team Lead & Scrum Master</strong>.</p>,
      image: fitnessImg1
    },
    {
      title: "Utmaning: Team & Kommunikation",
      type: "problem",
      content: <p>Den största utmaningen var inte koden, utan kommunikationen. Jag är väldigt engagerad och vill koda snabbt, men i ett team måste man vänta in varandra. Det lärde mig tålamod och vikten av tydliga uppgifter och gemensamma mål.</p>
    },
    {
      title: "Process: GitHub Projects",
      type: "solution",
      content: <p>För att få struktur satte jag upp en <strong>Kanban-board</strong> på GitHub och kopplade webhooks till vår Discord. Det gjorde att alla såg när en ny "Pull Request" kom in, vilket minskade ledtiderna.</p>,
      image: fitnessImg4
    },
    {
      title: "Funktion: Kostscheman",
      type: "code",
      content: <p>Vi byggde funktioner för att generera detaljerade kostscheman. Här använde vi objektorientering för att strukturera data kring kalorier och makronutrienter.</p>,
      image: fitnessImg3
    },
    {
      title: "PT-Vyn (Admin)",
      type: "intro",
      content: <p>PT:n har en egen vy för att hantera sina klienter. Här lärde jag mig mycket om hur man hanterar olika användarroller och behörigheter i en applikation.</p>,
      image: fitnessImg2
    }
  ],
  portfolio: [
    {
      title: "Projektöversikt",
      type: "intro",
      content: <p>Denna hemsida är mitt första riktiga projekt i <strong>React</strong> och <strong>JavaScript</strong>. Jag ville gå från den "tunga" Visual Studio-miljön (.NET) till den lättare VS Code-världen och lära mig modern frontend.</p>
    },
    {
      title: "Upplevelse: Flow & Kreativitet",
      type: "learning",
      content: <p>Det var både utmanande och otroligt roligt! Tiden flyger iväg när man sitter med CSS-animationer och direkt ser resultatet. Jag har fått en ny respekt för frontend-utveckling och hur mycket man kan göra med bibliotek som Framer Motion och Three.js.</p>
    },
    {
      title: "AI-Integrationen (RAG)",
      type: "code",
      content: <p>Chattboten du pratar med har en "System Prompt" som innehåller mitt CV. När du ställer en fråga, skickas den tillsammans med min profil till OpenAI. Det gör att den kan svara som mig, om mig.</p>
    },
    {
      title: "Prestanda & Optimering",
      type: "problem",
      content: <p>Att köra 3D i webbläsaren är tungt. Jag fick lära mig att optimera renderingen och hantera responsivitet så att sidan fungerar lika bra på en mobil som på en stor 4K-skärm.</p>
    },
    {
      title: "Feature: AI-Projektledare",
      type: "code",
      content: <p>Jag byggde en funktion där kunder kan skicka uppdragsförfrågningar. En AI-agent analyserar förfrågan i realtid, bedömer om den passar min tidsplan (8h gräns för pro bono) och ger direkt feedback innan mailet ens skickas.</p>
    }
  ],
  recon: [
    {
      title: "Projektöversikt",
      type: "intro",
      content: <p><strong>RECON</strong> är ett AI-drivet B2B-verktyg som analyserar företag i realtid. Genom att aggregera data från webbplatser, sociala medier, nyheter och finansiella rapporter genererar det actionable säljinsikter: ice breakers, pain points, sales hooks och finansiella signaler. Byggt under en 2-dagars workshop med InFiNetCode AB (13-14 dec 2024).</p>
    },
    {
      title: "Utmaning: Hastighet & Tillförlitlighet",
      type: "problem",
      content: <p>Den största utmaningen var att balansera <strong>hastighet</strong> och <strong>datakvalitet</strong>. Initialt tog sökningar 15-25 sekunder och förbrukade onödigt mycket API-kvot på health checks. Dessutom fanns risken för hallucineringar om AI:n inte hittade tillräckligt med data.</p>
    },
    {
      title: "Lösning: Multi-Provider Arkitektur",
      type: "solution",
      content: <p>Jag byggde en <strong>search orchestrator</strong> med automatisk fallback över 4 providers (Tavily, Serper, Brave, SerpAPI). Om en provider når sin gräns eller misslyckas, växlar systemet automatiskt till nästa. Detta gav oss 5750+ gratis sökningar/månad och 100% uptime.</p>
    },
    {
      title: "Kod: Modulär Arkitektur",
      type: "code",
      content: <p>Projektet följer <strong>Clean Architecture</strong> med tydlig separation: <code>/lib/types/</code> (TypeScript), <code>/lib/schemas/</code> (Zod validation), <code>/lib/validators/</code> (säkerhet), <code>/lib/services/</code> (business logic), <code>/lib/utils/</code> (helpers). Detta gjorde koden testbar och maintainable. Refaktorerade <code>actions.ts</code> från 720 rader till 157 rader (78% minskning!).</p>
    },
    {
      title: "Prestanda: 70% Snabbare",
      type: "learning",
      content: <p>Genom att implementera <strong>LRU-cache med TTL</strong>, eliminera onödiga health checks och optimera GPT-prompts fick jag ner söktiden från 15-25s till 5-8s. Det är en <strong>70% prestandaförbättring</strong> och 50% mindre API-användning. Även implementerade rate limiting, input validation och omfattande unit tests (34 tests, 100% coverage på säkerhetsfunktioner).</p>
    },
    {
      title: "Kodgranskning: 15/15 Issues Fixed",
      type: "learning",
      content: <p>Efter att projektet var klart körde jag en <strong>omfattande code review</strong> över 5 sessioner. Identifierade 15 issues (4 critical, 4 high, 4 medium, 3 low) och fixade alla systematiskt. Det lärde mig vikten av strukturerad kodgranskning, säkerhetsvalidering och att prioritera efter severity. Resultatet: ⭐⭐⭐⭐⭐ (5/5) kodkvalitet.</p>
    }
  ]
};

export { detectiveVideo };
