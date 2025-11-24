import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfilePhoto from './ProfilePhoto';
import ChatUI from './ChatUI';
import { Code, Terminal, User, Github, Linkedin, Mail, Languages, ExternalLink, Play, X, Download, Layers } from 'lucide-react';
import GithubStats from './GithubStats';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import ProjectSlideshow from './ProjectSlideshow';

// Importera videon
import detectiveVideo from '../assets/video.mp4';

// --- PROJEKTDATA (SLIDES) ---
const PROJECT_SLIDES = {
  detective: [
    {
      title: "Projektöversikt",
      type: "intro",
      content: <p><strong>Console Detective AI</strong> är ett textbaserat noir-detektivspel där ingen spelomgång är den andra lik. Genom att integrera OpenAI skapas brottsfall, dialoger och ledtrådar dynamiskt i realtid.</p>
    },
    {
      title: "Utmaningen: AI-konsistens",
      type: "problem",
      content: <p>Det svåraste var att få AI:n att vara konsekvent. I början kunde AI:n säga att mordvapnet var en kniv i ett rum, men en pistol i nästa. Spelaren måste kunna lita på ledtrådarna för att lösa fallet.</p>
    },
    {
      title: "Lösningen: System Prompts",
      type: "solution",
      content: <p>Jag löste det genom att skapa en robust <code>CaseContext</code>-klass som håller tillståndet (Vem, Vad, Var, Varför). Denna "sanning" skickas med som en dold System Prompt i varje anrop till OpenAI, så att den aldrig glömmer detaljerna.</p>,
      code: `// Exempel på System Prompt struktur
var prompt = $"Du är en spelledare för ett Noir-deckarspel.
FALLET:
Offer: {victim.Name}
Mördare: {killer.Name}
Vapen: {weapon}
Motiv: {motive}

Din uppgift: Beskriv rummet baserat på ovanstående fakta, men avslöja inte mördaren direkt.";`
    },
    {
      title: "Funktion: E-postsystemet",
      type: "code",
      content: <p>För att verifiera användare byggde jag en tjänst som skickar riktiga mail med koder. Jag använde <code>SmtpClient</code> och App Passwords för att säkert hantera utskicket.</p>
    },
    {
      title: "Lärdomar & Reflektion",
      type: "learning",
      content: <p>Jag lärde mig enormt mycket om <strong>Prompt Engineering</strong> och hur man hanterar tillstånd (State) i en applikation som är beroende av externa, "oberäkneliga" API:er. Jag fick också öva på att bygga snygga UI i konsolen med <code>Spectre.Console</code>.</p>
    }
  ],
  fitness: [
    {
      title: "Projektöversikt",
      type: "intro",
      content: <p><strong>Fitness Progress Tracker</strong> var ett omfattande grupparbete där vi byggde ett system för PTs och klienter. Jag axlade rollen som <strong>Team Lead & Scrum Master</strong>.</p>
    },
    {
      title: "Min Roll: Team Lead",
      type: "learning",
      content: <p>Utöver att koda arkitekturen ansvarade jag för att sätta upp <strong>GitHub Projects</strong> för vår Kanban-board, skapa Webhooks till Discord för notiser om Pull Requests, och hålla i Dailys. Det lärde mig vikten av tydlig kommunikation.</p>
    },
    {
      title: "Arkitektur: Generics & JSON",
      type: "code",
      content: <p>För att spara data (Användare, Scheman, Loggar) skapade jag en generisk <code>DataStore&lt;T&gt;</code>. Detta gjorde att vi slapp skriva om spara/ladda-kod för varje ny datatyp. DRY (Don't Repeat Yourself) i praktiken!</p>,
      code: `public class JsonDataStore<T> : IDataStore<T> 
{
    public void Save(List<T> items) 
    {
        string json = JsonSerializer.Serialize(items);
        File.WriteAllText(_filePath, json);
    }
    // ... Load method
}`
    },
    {
      title: "Utmaning: Merge Conflicts",
      type: "problem",
      content: <p>När fem personer jobbar i samma kodbas uppstår konflikter. Vi lärde oss den hårda vägen att arbeta i små, tydliga branches och göra Pull Requests ofta istället för stora "Big Bang"-merges i slutet av veckan.</p>
    },
    {
      title: "Resultat",
      type: "solution",
      content: <p>Vi levererade en fungerande applikation där PTs kan skapa scheman (med AI-stöd!) och klienter kan logga sin vikt och se sina framsteg. Koden är modulär, testbar och följer SOLID-principerna.</p>
    }
  ],
  portfolio: [
    {
      title: "Projektöversikt",
      type: "intro",
      content: <p>Denna hemsida är mitt gesällprov i modern frontend. Målet var att gå utanför min "Comfort Zone" (.NET) och bygga något visuellt och interaktivt med <strong>React</strong> och <strong>Three.js</strong>.</p>
    },
    {
      title: "AI-Integrationen (RAG)",
      type: "code",
      content: <p>Chattboten du pratar med har en "System Prompt" som innehåller mitt CV och min profil. När du ställer en fråga, skickas den tillsammans med min profil till OpenAI, vilket gör att den kan svara korrekt om mig.</p>,
      code: `const KLAS_CONTEXT = \`
Du är Klas Olsson. Svara i jag-form.
PROFIL:
- Namn: Klas Olsson
- Stack: C#, .NET, React
- Bakgrund: 22 år i fordonsindustrin
\`;`
    },
    {
      title: "Utmaning: Prestanda",
      type: "problem",
      content: <p>3D-grafik i webbläsaren kan vara tungt. Jag fick optimera <code>NodeNetwork</code>-bakgrunden genom att begränsa antalet partiklar och använda <code>useFrame</code> effektivt för att inte sänka FPS:en på laptops.</p>
    },
    {
      title: "Lärdomar",
      type: "learning",
      content: <p>Jag har lärt mig massor om <strong>Tailwind CSS</strong> för styling, <strong>Framer Motion</strong> för animationer och hur man deployar serverless-funktioner på Vercel. Det har gjort mig till en mer komplett Fullstack-utvecklare.</p>
    }
  ]
};

const TRANSLATIONS = {
  sv: {
    role: "Systemutvecklare .NET (Student)",
    nav: { about: "Snabbfakta", chat: "Fråga mig (AI)", projects: "Portfolio", cv: "Ladda ner CV" },
    titles: { whoami: "Vem är jag?", ai: "Fråga mig vad som helst", projects: "Projekt" },
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
    role: ".NET System Developer (Student)",
    nav: { about: "Quick Facts", chat: "Ask me (AI)", projects: "Portfolio", cv: "Download CV" },
    titles: { whoami: "Who am I?", ai: "Ask me anything", projects: "Projects" },
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

function calculateAge(birthday) {
  const ageDifMs = Date.now() - new Date(birthday).getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const HeroStage = () => {
  const [section, setSection] = useState('about');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [lang, setLang] = useState('sv');
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeSlideshow, setActiveSlideshow] = useState(null); // State för slideshow

  const t = TRANSLATIONS[lang]; 
  const myAge = calculateAge('1981-02-04');

  const toggleLang = () => setLang(l => l === 'sv' ? 'en' : 'sv');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative z-10">
      
      {/* --- VIDEO MODAL --- */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setActiveVideo(null)}
          >
            <div className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden border border-neon-purple/50 shadow-2xl shadow-neon-purple/20" onClick={e => e.stopPropagation()}>
              <button onClick={() => setActiveVideo(null)} className="absolute top-4 right-4 z-10 text-white hover:text-neon-cyan bg-black/50 rounded-full p-2 transition-colors">
                <X size={24} />
              </button>
              <video controls autoPlay className="w-full h-auto max-h-[80vh]">
                <source src={activeVideo} type="video/mp4" />
              </video>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SLIDESHOW MODAL --- */}
      <ProjectSlideshow 
        isOpen={!!activeSlideshow}
        onClose={() => setActiveSlideshow(null)}
        slides={activeSlideshow?.slides}
        title={activeSlideshow?.title}
      />

      <motion.div 
        layout
        className="w-full max-w-7xl bg-[#0a0b1e]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
        style={{ borderRadius: 24, boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}
      >
        {/* VÄNSTER: Profil & Kontakt */}
        <motion.div layout className="p-5 md:p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-white/10 flex flex-col items-center md:items-start relative overflow-y-auto custom-scrollbar">
          
          <div className="flex w-full justify-between md:justify-end gap-3 mb-2 relative z-20">
            <button onClick={toggleLang} className="flex items-center gap-2 text-[10px] text-gray-400 hover:text-neon-cyan uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/10 transition-colors">
               <Languages size={12}/> {lang === 'sv' ? "EN" : "SV"}
            </button>
            <button onClick={() => setReduceMotion(!reduceMotion)} className="text-[10px] text-gray-600 hover:text-white uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/10 transition-colors">
              {reduceMotion ? "Motion: OFF" : "Motion: ON"}
            </button>
          </div>

          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-transparent pointer-events-none"></div>
          
          <ProfilePhoto disableMotion={reduceMotion} />
          
          <motion.div layout className="mt-4 text-center md:text-left z-10">
            <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold tracking-tight animate-text-gradient bg-clip-text text-transparent pb-1">
              Klas Olsson
            </h1>
            <p className="text-neon-cyan font-mono text-xs md:text-sm mt-1 uppercase tracking-wider">{t.role}</p>
          </motion.div>

          <div className="flex flex-wrap items-center gap-4 my-4 z-10">
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText('klasolsson81@gmail.com');
                  toast.success('Email kopierad till urklipp!');
                }}
                className="text-gray-400 hover:text-neon-cyan transition-colors cursor-pointer" 
                title="Kopiera Email"
              >
                <Mail size={20} />
              </button>
              <a href="https://github.com/klasolsson81" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors" title="GitHub"><Github size={20} /></a>
              <a href="https://www.linkedin.com/in/klasolsson81/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#0077b5] transition-colors" title="LinkedIn"><Linkedin size={20} /></a>
            </div>

            <div className="hidden md:block w-px h-5 bg-white/20"></div>

            <a 
              href="/CV_Klas_Olsson.pdf" 
              download="CV_Klas_Olsson.pdf"
              onClick={() => {
                confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 },
                  colors: ['#00f3ff', '#bd00ff', '#ffffff']
                });
                toast.success('Tack för visat intresse! CV laddas ner.');
              }}
              className="flex items-center gap-2 bg-neon-purple/20 hover:bg-neon-purple/40 text-neon-cyan border border-neon-purple/50 px-3 py-1 rounded-lg transition-all font-bold text-[10px] uppercase tracking-wider group cursor-pointer"
            >
              <Download size={12} className="group-hover:-translate-y-0.5 transition-transform"/>
              <span>CV</span>
            </a>
          </div>

          <nav className="w-full space-y-2 z-10 pb-2">
            <NavButton label={t.nav.about} icon={<User size={16}/>} active={section === 'about'} onClick={() => setSection('about')} />
            <NavButton label={t.nav.chat} icon={<Terminal size={16}/>} active={section === 'chat'} onClick={() => setSection('chat')} />
            <NavButton label={t.nav.projects} icon={<Code size={16}/>} active={section === 'projects'} onClick={() => setSection('projects')} />
          </nav>
        </motion.div>

        {/* HÖGER: Innehåll */}
        <motion.div 
          layout 
          className="flex-1 p-5 md:p-8 bg-black/30 relative flex flex-col overflow-hidden h-[60dvh] md:h-auto"
        >
          <AnimatePresence mode="wait">
            
            {section === 'about' && (
              <motion.div 
                key="about" 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-6 overflow-y-auto pr-2 custom-scrollbar h-full"
              >
                <h2 className="text-2xl font-bold text-neon-purple mb-4">{t.titles.whoami}</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed text-sm md:text-base">
                  <p><strong className="text-white">{t.about.intro1.split('.')[0]}.</strong> {t.about.intro1.split('.').slice(1).join('.')}.</p>
                  <p dangerouslySetInnerHTML={{ __html: t.about.intro2.replace('n8n', '<span class="text-neon-cyan font-bold">n8n</span>') }} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                  <div>
                     <h3 className="text-[10px] font-bold mb-2 uppercase tracking-widest animate-subtitle-shimmer bg-clip-text text-transparent">
                     {t.about.factsTitle}
                     </h3>
                     <ul className="space-y-1.5 text-sm text-gray-300">
                       <li><span className="text-neon-purple">➤</span> {t.about.facts.age}: <span className="text-white">{myAge}</span></li>
                       <li><span className="text-neon-purple">➤</span> {t.about.facts.city}: {t.about.factValues.city}</li>
                       <li><span className="text-neon-purple">➤</span> {t.about.facts.lang}: {t.about.factValues.lang}</li>
                       <li><span className="text-neon-purple">➤</span> {t.about.facts.family}: {t.about.factValues.family}</li>
                     </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-[10px] font-bold mb-2 uppercase tracking-widest animate-subtitle-shimmer bg-clip-text text-transparent">
                    {t.about.stackTitle}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                        {['C#', '.NET 8', 'SQL Server', 'Entity Framework', 'React', 'Tailwind CSS', 'Azure', 'Docker', 'Git', 'n8n', 'AI Integration'].map(tag => (
                        <span key={tag} className="px-2 py-1 bg-neon-purple/10 border border-neon-purple/30 rounded text-[10px] md:text-xs text-neon-cyan font-mono cursor-default hover:bg-neon-purple/20 transition-colors">
                            {tag}
                        </span>
                        ))}
                    </div>
                  </div>
                </div>

                <GithubStats />

              </motion.div>
            )}

            {section === 'chat' && (
              <motion.div 
                key="chat" 
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                className="h-full flex flex-col"
              >
                <h2 className="text-2xl font-bold text-neon-purple mb-4">{t.titles.ai}</h2>
                <ChatUI lang={lang} />
              </motion.div>
            )}

            {section === 'projects' && (
              <motion.div 
                key="projects" 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-4 overflow-y-auto pr-2 custom-scrollbar h-full"
              >
                <h2 className="text-2xl font-bold text-neon-purple mb-4">{t.titles.projects}</h2>
                
                <ProjectCard 
                  title="Console Detective AI" 
                  desc={lang === 'sv' 
                    ? "Ett textbaserat noir-detektivspel där du löser AI-genererade brott. Innehåller inbyggt e-postsystem och dynamisk pixel-art." 
                    : "A text-based noir detective game where you solve AI-generated crimes. Features built-in email system and dynamic pixel art."}
                  tags={['C#', '.NET 8', 'OpenAI API', 'Spectre.Console']}
                  link="https://github.com/klasolsson81/Console_Detective"
                  videoSrc={detectiveVideo} 
                  onPlay={() => setActiveVideo(detectiveVideo)}
                  watchText={t.projects.watch}
                  onDetails={() => setActiveSlideshow({ title: "Console Detective AI", slides: PROJECT_SLIDES.detective })}
                  detailsText={t.projects.details}
                />

                <ProjectCard 
                  title="Fitness Progress Tracker" 
                  desc={lang === 'sv' 
                    ? "Jag var Team Lead & Scrum Master för detta grupparbete. En terminal-app för PTs och klienter med starkt fokus på OOP, JSON och struktur." 
                    : "I was Team Lead & Scrum Master for this group project. A terminal app for PTs and clients focusing heavily on OOP, JSON, and structure."}
                  tags={['Team Lead', 'Scrum', 'C#', 'OOP']}
                  link="https://github.com/klasolsson81/FitnessProgressTracker"
                  onDetails={() => setActiveSlideshow({ title: "Fitness Progress Tracker", slides: PROJECT_SLIDES.fitness })}
                  detailsText={t.projects.details}
                />

                <ProjectCard 
                  title="Portfolio AI (This Site)" 
                  desc={lang === 'sv' 
                    ? "Min personliga hemsida. Byggd med React, Three.js och en integrerad AI-agent som svarar på frågor om mig." 
                    : "My personal website. Built with React, Three.js and an integrated AI agent that answers questions about me."}
                  tags={['React', 'Vite', 'Three.js', 'Vercel AI']}
                  link="https://github.com/klasolsson81/portfolio-klas"
                  onDetails={() => setActiveSlideshow({ title: "Portfolio AI", slides: PROJECT_SLIDES.portfolio })}
                  detailsText={t.projects.details}
                />

                 <div className="mt-4 p-4 border-2 border-dashed border-white/10 rounded-xl text-center text-gray-500 text-xs bg-black/20">
                   {t.projects.more}
                 </div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

const NavButton = ({ label, icon, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group
      ${active ? 'bg-gradient-to-r from-neon-purple/20 to-transparent text-white border-l-2 border-neon-purple' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
    `}
  >
    <span className={`transition-colors ${active ? 'text-neon-cyan' : 'group-hover:text-neon-purple'}`}>{icon}</span>
    {label}
  </button>
);

const ProjectCard = ({ title, desc, tags, link, videoSrc, onPlay, watchText, onDetails, detailsText }) => (
  <div className="bg-gradient-to-br from-white/5 to-transparent p-5 rounded-xl border border-white/10 hover:border-neon-cyan/50 transition-all group shadow-lg hover:shadow-neon-cyan/20 relative">
    <div className="flex justify-between items-start pr-8">
      <h3 className="font-bold text-base md:text-lg text-white group-hover:text-neon-cyan transition-colors">{title}</h3>
      <a href={link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="View Code">
        <ExternalLink size={18} />
      </a>
    </div>
    
    <p className="text-xs md:text-sm text-gray-300 mt-2 mb-3 leading-relaxed">{desc}</p>
    
    <div className="flex gap-3 mb-3">
        {videoSrc && (
            <button 
              onClick={(e) => { e.preventDefault(); onPlay(); }}
              className="flex items-center gap-2 px-2 py-1 bg-neon-purple/20 text-neon-purple border border-neon-purple/50 rounded-md text-[10px] font-bold uppercase tracking-wider hover:bg-neon-purple hover:text-white transition-colors"
            >
                <Play size={10} fill="currentColor" /> {watchText}
            </button>
        )}
        
        {/* NY KNAPP: Deep Dive / Detaljer */}
        <button 
          onClick={(e) => { e.preventDefault(); onDetails(); }}
          className="flex items-center gap-2 px-2 py-1 bg-white/5 text-gray-300 border border-white/10 rounded-md text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 hover:text-white transition-colors"
        >
            <Layers size={10} fill="currentColor" /> {detailsText}
        </button>
    </div>

    <div className="flex flex-wrap gap-1.5 mt-auto">
      {tags.map(t => (
        <span key={t} className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-md border border-white/10
            ${t === 'Team Lead' || t === 'Scrum' ? 'bg-neon-purple/20 text-white border-neon-purple/30' : 'bg-black/40 text-gray-400'}
        `}>
            {t}
        </span>
      ))}
    </div>
  </div>
);

export default HeroStage;