import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfilePhoto from './ProfilePhoto';
import ChatUI from './ChatUI';
import { Code, Terminal, User, Github, Linkedin, Mail, Languages, ExternalLink, Play, X, Download, Layers, Briefcase, Moon, Sun, TrendingUp } from 'lucide-react';
import GithubStats from './GithubStats';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import ProjectSlideshow from './ProjectSlideshow';
import HireMe from './HireMe';
// FloatingCTA borttagen - Anlita-knappen har nu skiftande färger istället
import DevTimeline from './DevTimeline';

// VIDEO
import detectiveVideo from '../assets/video.mp4';

// BILDER
import detectiveImg1 from '../assets/detective-1.png';
import detectiveImg2 from '../assets/detective-2.png';
import detectiveImg3 from '../assets/detective-3.png';

import fitnessImg1 from '../assets/fitness-1.png';
import fitnessImg2 from '../assets/fitness-2.png';
import fitnessImg3 from '../assets/fitness-3.png';
import fitnessImg4 from '../assets/fitness-4.png';

// --- PROJEKTDATA ---
const PROJECT_SLIDES = {
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
  ]
};

const TRANSLATIONS = {
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


function calculateAge(birthday) {
  const ageDifMs = Date.now() - new Date(birthday).getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const HeroStage = ({ isDark, toggleTheme }) => {
  const [section, setSection] = useState('about');
  const [lang, setLang] = useState('sv');
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeSlideshow, setActiveSlideshow] = useState(null);

  // FIX: Automatisk språk-detektering vid start
  useEffect(() => {
    const userLang = navigator.language || navigator.userLanguage;
    if (!userLang.startsWith('sv')) {
      setLang('en');
    }
  }, []);

  const t = TRANSLATIONS[lang]; 
  const myAge = calculateAge('1981-02-04');

  const toggleLang = () => setLang(l => l === 'sv' ? 'en' : 'sv');

  return (
    <div className="min-h-screen md:flex md:items-center md:justify-center p-3 md:p-8 relative z-10">
      
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

      <ProjectSlideshow 
        isOpen={!!activeSlideshow}
        onClose={() => setActiveSlideshow(null)}
        slides={activeSlideshow?.slides}
        title={activeSlideshow?.title}
        isDark={isDark}
      />

      <motion.div 
        layout
        className={`w-full max-w-7xl rounded-2xl md:rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row md:max-h-[95vh] md:h-[850px] transition-all duration-500 relative z-10
          ${isDark 
            ? 'bg-neon-darkbg/80 backdrop-blur-xl border border-white/10 shadow-2xl' 
            : 'bg-white/50 backdrop-blur-2xl border border-white/50 shadow-xl shadow-purple-500/10'}`}
        style={{ borderRadius: 24 }}
      >
        {/* MOBIL HEADER - Kompakt och ren */}
        <div className={`md:hidden p-3 border-b ${isDark ? 'border-white/10' : 'border-warm-border'}`}>
          {/* Rad 1: Foto + Namn + Settings */}
          <div className="flex items-center gap-3">
            {/* Profilfoto - centrerat */}
            <div className={`w-12 h-12 rounded-full overflow-hidden border-2 shrink-0
              ${isDark ? 'border-neon-purple/50' : 'border-warm-accent/30'}`}>
              <ProfilePhoto disableMotion={true} isDark={isDark} small={true} />
            </div>

            {/* Namn */}
            <div className="flex-1 min-w-0">
              <h1 className={`text-lg font-bold bg-clip-text text-transparent
                ${isDark ? 'animate-text-gradient' : 'light-mode-gradient'}`}>
                Klas Olsson
              </h1>
            </div>

            {/* Settings-knappar */}
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={toggleTheme} 
                className={`w-8 h-8 rounded-full border flex items-center justify-center
                  ${isDark 
                    ? 'text-gray-400 bg-black/40 border-white/10' 
                    : 'text-warm-muted bg-white/60 border-warm-border'}`}
              >
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
              </button>
              <button 
                onClick={toggleLang} 
                className={`w-8 h-8 rounded-full border flex items-center justify-center overflow-hidden
                  ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/60 border-warm-border'}`}
              >
                <span className={`fi fi-${lang === 'sv' ? 'se' : 'gb'} fis text-sm`}></span>
              </button>
            </div>
          </div>

          {/* Rad 2: Titel + Sociala + CV */}
          <div className="flex items-center justify-between mt-2">
            <p className={`font-mono text-[10px] uppercase tracking-wider
              ${isDark ? 'text-neon-cyan' : 'text-warm-accent'}`}>
              {t.role}
            </p>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {navigator.clipboard.writeText('klasolsson81@gmail.com'); toast.success('Email kopierad!');}} 
                className={`${isDark ? 'text-gray-400 hover:text-neon-cyan' : 'text-warm-muted hover:text-warm-accent'}`}
              >
                <Mail size={18} />
              </button>
              <a href="https://github.com/klasolsson81" target="_blank" rel="noreferrer" 
                className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-warm-muted hover:text-warm-text'}`}>
                <Github size={18} />
              </a>
              <a href="https://www.linkedin.com/in/klasolsson81/" target="_blank" rel="noreferrer" 
                className={`${isDark ? 'text-gray-400 hover:text-[#0077b5]' : 'text-warm-muted hover:text-[#0077b5]'}`}>
                <Linkedin size={18} />
              </a>
              <a 
                href="/CV_Klas_Olsson.pdf" 
                download="CV_Klas_Olsson.pdf"
                onClick={() => {confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } }); toast.success('CV laddas ner!');}}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold
                  ${isDark 
                    ? 'bg-neon-purple/20 border border-neon-purple/30 text-neon-cyan' 
                    : 'bg-purple-100/70 border border-purple-200 text-warm-accent'}`}
              >
                <Download size={13} />
                CV
              </a>
            </div>
          </div>

          {/* Rad 3: Navigation */}
          <nav className="flex mt-3">
            <MobileNavButton label={t.nav.about} icon={<User size={15} />} active={section === 'about'} onClick={() => { setSection('about'); window.scrollTo(0, 0); }} isDark={isDark} />
            <MobileNavButton label={t.nav.journey} icon={<TrendingUp size={15} />} active={section === 'journey'} onClick={() => { setSection('journey'); window.scrollTo(0, 0); }} isDark={isDark} />
            <MobileNavButton label={t.nav.chat} icon={<Terminal size={15} />} active={section === 'chat'} onClick={() => { setSection('chat'); window.scrollTo(0, 0); }} isDark={isDark} />
            <MobileNavButton label={t.nav.projects} icon={<Code size={15} />} active={section === 'projects'} onClick={() => { setSection('projects'); window.scrollTo(0, 0); }} isDark={isDark} />
            <MobileNavButton label={t.nav.hire} icon={<Briefcase size={15} />} active={section === 'hire'} onClick={() => { setSection('hire'); window.scrollTo(0, 0); }} isDark={isDark} isHire={true} />
          </nav>
        </div>

        {/* DESKTOP: Vänster sidopanel (dold på mobil) */}
        <motion.div 
          layout 
          className={`hidden md:flex p-6 md:w-1/3 border-r flex-col items-start relative overflow-y-auto custom-scrollbar shrink-0
            ${isDark ? 'border-white/10 bg-black/20' : 'border-white/30 bg-white/20'}`}
        >          
          <div className="flex w-full justify-end gap-3 mb-2 relative z-20">
            <button 
              onClick={toggleTheme} 
              className={`flex items-center justify-center w-8 h-8 rounded-full border transition-colors shadow-sm
                ${isDark 
                  ? 'text-gray-400 hover:text-neon-cyan bg-black/40 border-white/10' 
                  : 'text-warm-muted hover:text-warm-accent bg-white/60 border-warm-border hover:border-warm-accent/30'}`}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button 
              onClick={toggleLang} 
              className={`flex items-center justify-center w-8 h-8 rounded-full border transition-colors shadow-sm hover:scale-105 active:scale-95 overflow-hidden
                ${isDark 
                  ? 'bg-black/40 border-white/10' 
                  : 'bg-white/60 border-warm-border'}`}
              title="Change Language"
            >
              <span className={`fi fi-${lang === 'sv' ? 'se' : 'gb'} fis text-lg`}></span>
            </button>
          </div>

          <div className={`absolute inset-0 pointer-events-none
            ${isDark 
              ? 'bg-gradient-to-br from-neon-purple/10 to-transparent' 
              : 'bg-gradient-to-br from-purple-100/30 via-transparent to-amber-50/20'}`}
          ></div>
          
          <ProfilePhoto isDark={isDark} />
          
          <motion.div layout className="mt-4 text-left z-10">
            <h1 className={`text-2xl md:text-3xl xl:text-4xl font-bold tracking-tight bg-clip-text text-transparent pb-1 whitespace-nowrap
              ${isDark ? 'animate-text-gradient' : 'light-mode-gradient'}`}>
              Klas Olsson
            </h1>
            <p className={`font-mono text-sm mt-1 uppercase tracking-wider
              ${isDark ? 'text-neon-cyan' : 'text-warm-accent'}`}>
              {t.role}
            </p>
          </motion.div>

          <div className="flex flex-wrap items-center justify-start gap-4 my-4 z-10 w-full">
            <div className="flex gap-3">
              <button 
                onClick={() => {navigator.clipboard.writeText('klasolsson81@gmail.com'); toast.success('Email kopierad!');}} 
                className={`transition-colors cursor-pointer p-1
                  ${isDark 
                    ? 'text-gray-400 hover:text-neon-cyan' 
                    : 'text-warm-muted hover:text-warm-accent'}`}
                title="Kopiera Email"
              >
                <Mail size={22} />
              </button>
              <a 
                href="https://github.com/klasolsson81" 
                target="_blank" 
                rel="noreferrer" 
                className={`transition-colors p-1
                  ${isDark 
                    ? 'text-gray-400 hover:text-white' 
                    : 'text-warm-muted hover:text-warm-text'}`}
                title="GitHub"
              >
                <Github size={22} />
              </a>
              <a 
                href="https://www.linkedin.com/in/klasolsson81/" 
                target="_blank" 
                rel="noreferrer" 
                className={`transition-colors p-1
                  ${isDark 
                    ? 'text-gray-400 hover:text-[#0077b5]' 
                    : 'text-warm-muted hover:text-[#0077b5]'}`}
                title="LinkedIn"
              >
                <Linkedin size={22} />
              </a>
            </div>

            <div className={`w-px h-5 ${isDark ? 'bg-white/20' : 'bg-warm-border'}`}></div>

            <a 
              href="/CV_Klas_Olsson.pdf" 
              download="CV_Klas_Olsson.pdf"
              onClick={() => {confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#00f3ff', '#bd00ff', '#ffffff'] }); toast.success('Tack för visat intresse! CV laddas ner.');}}
              className={`relative group flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm
                ${isDark 
                  ? 'bg-neon-purple/10 border border-neon-purple/30 text-neon-cyan hover:bg-neon-purple/20 hover:border-neon-purple' 
                  : 'bg-purple-100/70 border border-purple-200 text-warm-accent hover:bg-purple-100 hover:border-warm-accent'}`}
              title={t.nav.cv}
            >
              <Download size={18} className="relative z-10 group-hover:-translate-y-0.5 transition-transform duration-300"/>
              <span className="relative z-10 font-bold text-sm tracking-wider leading-none pt-0.5">CV</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="w-full z-10 pb-2 flex flex-col space-y-1.5">
            <NavButton label={t.nav.about} icon={<User />} active={section === 'about'} onClick={() => setSection('about')} isDark={isDark} />
            <NavButton label={t.nav.journey} icon={<TrendingUp />} active={section === 'journey'} onClick={() => setSection('journey')} isDark={isDark} />
            <NavButton label={t.nav.chat} icon={<Terminal />} active={section === 'chat'} onClick={() => setSection('chat')} isDark={isDark} />
            <NavButton label={t.nav.projects} icon={<Code />} active={section === 'projects'} onClick={() => setSection('projects')} isDark={isDark} />
            <HireNavButton label={t.nav.hire} icon={<Briefcase />} active={section === 'hire'} onClick={() => setSection('hire')} isDark={isDark} />
          </nav>
        </motion.div>

        {/* INNEHÅLL - Scrollar på mobil, fixed på desktop */}
        <motion.div 
          layout 
          className={`flex-1 min-h-0 p-4 md:p-8 relative flex flex-col md:overflow-hidden transition-colors duration-500
            ${isDark ? 'bg-black/30' : 'bg-white/20'}`}
        >
          <AnimatePresence mode="wait">
            
            {section === 'about' && (
              <motion.div 
                key="about" 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-6 md:overflow-y-auto md:pr-2 custom-scrollbar md:h-full"
              >
                <h2 className={`text-xl md:text-2xl font-bold mb-4 ${isDark ? 'text-neon-purple' : 'text-warm-accent'}`}>
                  {t.titles.whoami}
                </h2>
                <div className={`space-y-4 leading-relaxed text-sm md:text-base ${isDark ? 'text-gray-300' : 'text-warm-muted'}`}>
                  <p>
                    <strong className={isDark ? 'text-white' : 'text-warm-text'}>
                      {t.about.intro1.split('.')[0]}.
                    </strong> 
                    {t.about.intro1.split('.').slice(1).join('.')}
                  </p>
                  <p dangerouslySetInnerHTML={{ __html: t.about.intro2.replace('n8n', `<span class="${isDark ? 'text-neon-cyan' : 'text-warm-accent'} font-bold">n8n</span>`) }} />
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t ${isDark ? 'border-white/10' : 'border-warm-border'}`}>
                  <div>
                    <h3 className={`text-[10px] font-bold mb-2 uppercase tracking-widest bg-clip-text text-transparent
                      ${isDark ? 'animate-subtitle-shimmer' : 'light-subtitle-shimmer'}`}>
                      {t.about.factsTitle}
                    </h3>
                    <ul className={`space-y-1.5 text-sm ${isDark ? 'text-gray-300' : 'text-warm-muted'}`}>
                      <li><span className={isDark ? 'text-neon-purple' : 'text-warm-accent'}>➤</span> {t.about.facts.age}: <span className={isDark ? 'text-white' : 'text-warm-text'}>{myAge}</span></li>
                      <li><span className={isDark ? 'text-neon-purple' : 'text-warm-accent'}>➤</span> {t.about.facts.city}: {t.about.factValues.city}</li>
                      <li><span className={isDark ? 'text-neon-purple' : 'text-warm-accent'}>➤</span> {t.about.facts.lang}: {t.about.factValues.lang}</li>
                      <li><span className={isDark ? 'text-neon-purple' : 'text-warm-accent'}>➤</span> {t.about.facts.family}: {t.about.factValues.family}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className={`text-[10px] font-bold mb-2 uppercase tracking-widest bg-clip-text text-transparent
                      ${isDark ? 'animate-subtitle-shimmer' : 'light-subtitle-shimmer'}`}>
                      {t.about.stackTitle}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {['C#', '.NET 8', 'SQL Server', 'Entity Framework', 'React', 'Tailwind CSS', 'Azure', 'Docker', 'Git', 'n8n', 'AI Integration'].map(tag => (
                        <span 
                          key={tag} 
                          className={`px-2 py-1 rounded text-[10px] md:text-xs font-mono cursor-default transition-colors
                            ${isDark 
                              ? 'bg-neon-purple/10 border border-neon-purple/30 text-neon-cyan hover:bg-neon-purple/20' 
                              : 'bg-purple-100/70 border border-purple-200 text-warm-accent hover:bg-purple-100'}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <GithubStats isDark={isDark} />
              </motion.div>
            )}

            {/* NY SEKTION: Min resa / DevTimeline */}
            {section === 'journey' && (
              <motion.div 
                key="journey" 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex-1 min-h-0 flex flex-col md:overflow-hidden"
              >
                <DevTimeline lang={lang} isDark={isDark} />
              </motion.div>
            )}

            {section === 'chat' && (
              <motion.div 
                key="chat" 
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                className="flex-1 min-h-0 flex flex-col md:overflow-hidden"
              >
                <h2 className={`shrink-0 text-xl md:text-2xl font-bold mb-4 ${isDark ? 'text-neon-purple' : 'text-warm-accent'}`}>
                  {t.titles.ai}
                </h2>
                <ChatUI lang={lang} isDark={isDark} />
              </motion.div>
            )}

            {section === 'projects' && (
              <motion.div 
                key="projects" 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-4 md:overflow-y-auto md:pr-2 custom-scrollbar md:h-full"
              >
                <h2 className={`text-xl md:text-2xl font-bold mb-4 ${isDark ? 'text-neon-purple' : 'text-warm-accent'}`}>
                  {t.titles.projects}
                </h2>
                
                <ProjectCard 
                  title="Console Detective AI" 
                  desc={lang === 'sv' ? "Ett textbaserat noir-detektivspel..." : "A text-based noir detective game..."}
                  tags={['C#', '.NET 8', 'OpenAI API', 'Spectre.Console']}
                  link="https://github.com/klasolsson81/Console_Detective"
                  videoSrc={detectiveVideo} 
                  onPlay={() => setActiveVideo(detectiveVideo)}
                  watchText={t.projects.watch}
                  onDetails={() => setActiveSlideshow({ title: "Console Detective AI", slides: PROJECT_SLIDES.detective })}
                  detailsText={t.projects.details}
                  isDark={isDark}
                />
                <ProjectCard 
                  title="Fitness Progress Tracker" 
                  desc={lang === 'sv' ? "Jag var Team Lead & Scrum Master..." : "I was Team Lead & Scrum Master..."}
                  tags={['Team Lead', 'Scrum', 'C#', 'OOP']}
                  link="https://github.com/klasolsson81/FitnessProgressTracker"
                  onDetails={() => setActiveSlideshow({ title: "Fitness Progress Tracker", slides: PROJECT_SLIDES.fitness })}
                  detailsText={t.projects.details}
                  isDark={isDark}
                />
                <ProjectCard 
                  title="Portfolio AI (This Site)" 
                  desc={lang === 'sv' ? "Min personliga hemsida..." : "My personal website..."}
                  tags={['React', 'Vite', 'Three.js', 'Vercel AI']}
                  link="https://github.com/klasolsson81/portfolio-klas"
                  onDetails={() => setActiveSlideshow({ title: "Portfolio AI", slides: PROJECT_SLIDES.portfolio })}
                  detailsText={t.projects.details}
                  isDark={isDark}
                />

                <div className={`mt-4 p-4 border-2 border-dashed rounded-xl text-center text-xs
                  ${isDark 
                    ? 'border-white/10 text-gray-500 bg-black/20' 
                    : 'border-warm-border text-warm-subtle bg-warm-hover/50'}`}>
                  {t.projects.more}
                </div>
              </motion.div>
            )}

            {section === 'hire' && (
              <motion.div 
                key="hire" 
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                className="md:h-full flex flex-col md:overflow-y-auto custom-scrollbar"
              >
                <HireMe lang={lang} isDark={isDark} />
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Desktop NavButton
const NavButton = ({ label, icon, active, onClick, isDark }) => (
  <button 
    onClick={onClick}
    className={`w-full flex flex-row items-center justify-start gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group
      ${active 
        ? isDark 
          ? 'bg-neon-purple/20 text-white border-l-2 border-neon-purple' 
          : 'bg-purple-100/70 text-warm-text border-l-2 border-warm-accent'
        : isDark 
          ? 'text-gray-400 hover:bg-white/5 hover:text-white' 
          : 'text-warm-muted hover:bg-warm-hover hover:text-warm-text'}
    `}
  >
    <span className={`transition-colors ${active 
      ? isDark ? 'text-neon-cyan' : 'text-warm-accent' 
      : isDark ? 'group-hover:text-neon-purple' : 'group-hover:text-warm-accent'}`}>
      {React.cloneElement(icon, { size: 16 })}
    </span>
    <span>{label}</span>
  </button>
);

// Mobil NavButton - kompakt utan truncate
const MobileNavButton = ({ label, icon, active, onClick, isDark, isHire }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-lg text-[9px] font-medium transition-all duration-200
      ${active 
        ? isDark 
          ? 'bg-neon-purple/20 text-white' 
          : 'bg-purple-100/70 text-warm-text'
        : isDark 
          ? 'text-gray-400 hover:bg-white/5' 
          : 'text-warm-muted hover:bg-warm-hover'}
    `}
  >
    <span className={`transition-colors ${active 
      ? isDark ? 'text-neon-cyan' : 'text-warm-accent' 
      : ''}`}>
      {icon}
    </span>
    <span className={`text-center whitespace-nowrap ${isHire && !active 
      ? isDark ? 'animate-subtitle-shimmer bg-clip-text text-transparent font-bold' : 'light-subtitle-shimmer bg-clip-text text-transparent font-bold'
      : ''}`}>
      {label}
    </span>
  </button>
);

// Desktop Anlita-knapp med shimmer-text
const HireNavButton = ({ label, icon, active, onClick, isDark }) => (
  <button 
    onClick={onClick}
    className={`w-full flex flex-row items-center justify-start gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group
      ${active 
        ? isDark 
          ? 'bg-neon-purple/20 text-white border-l-2 border-neon-purple' 
          : 'bg-purple-100/70 text-warm-text border-l-2 border-warm-accent'
        : isDark 
          ? 'text-gray-400 hover:bg-white/5 hover:text-white' 
          : 'text-warm-muted hover:bg-warm-hover hover:text-warm-text'}
    `}
  >
    <span className={`transition-colors ${active 
      ? isDark ? 'text-neon-cyan' : 'text-warm-accent' 
      : isDark ? 'group-hover:text-neon-purple' : 'group-hover:text-warm-accent'}`}>
      {React.cloneElement(icon, { size: 16 })}
    </span>
    {/* Text med shimmer-effekt */}
    <span className={`font-bold bg-clip-text text-transparent
      ${isDark ? 'animate-subtitle-shimmer' : 'light-subtitle-shimmer'}`}>
      {label}
    </span>
  </button>
);

const ProjectCard = ({ title, desc, tags, link, videoSrc, onPlay, watchText, onDetails, detailsText, isDark }) => (
  <div className={`p-5 rounded-xl border transition-all group relative shadow-lg
    ${isDark 
      ? 'bg-gradient-to-br from-white/5 to-transparent border-white/10 hover:border-neon-cyan/50 hover:shadow-neon-cyan/20' 
      : 'bg-white/60 border-warm-border hover:border-warm-accent/50 hover:shadow-warm-accent/10'}`}>
      
    <div className="flex justify-between items-start pr-8">
      <h3 className={`font-bold text-base md:text-lg transition-colors
        ${isDark 
          ? 'text-white group-hover:text-neon-cyan' 
          : 'text-warm-text group-hover:text-warm-accent'}`}>
        {title}
      </h3>
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-warm-subtle hover:text-warm-text'}`} 
        title="View Code"
      >
        <ExternalLink size={18} />
      </a>
    </div>
    
    <p className={`text-xs md:text-sm mt-2 mb-3 leading-relaxed ${isDark ? 'text-gray-300' : 'text-warm-muted'}`}>
      {desc}
    </p>
    
    <div className="flex gap-3 mb-3">
      {videoSrc && (
        <button 
          onClick={(e) => { e.preventDefault(); onPlay(); }} 
          className={`flex items-center gap-2 px-3 py-1.5 border rounded-md text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm
            ${isDark 
              ? 'bg-neon-purple/10 text-neon-purple border-neon-purple/30 hover:bg-neon-purple hover:text-white' 
              : 'bg-purple-100/70 text-warm-accent border-purple-200 hover:bg-warm-accent hover:text-white'}`}
        >
          <Play size={12} fill="currentColor" /> {watchText}
        </button>
      )}
      <button 
        onClick={(e) => { e.preventDefault(); onDetails(); }} 
        className={`flex items-center gap-2 px-3 py-1.5 border rounded-md text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm
          ${isDark 
            ? 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30 hover:bg-neon-cyan hover:text-black' 
            : 'bg-warm-hover text-warm-text border-warm-border hover:bg-warm-active hover:text-warm-text'}`}
      >
        <Layers size={12} /> {detailsText}
      </button>
    </div>
    
    <div className="flex flex-wrap gap-1.5 mt-auto">
      {tags.map(t => (
        <span 
          key={t} 
          className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-md border 
            ${isDark 
              ? (t === 'Team Lead' || t === 'Scrum' 
                  ? 'bg-neon-purple/20 text-white border-neon-purple/30' 
                  : 'bg-black/40 text-gray-400 border-white/10')
              : (t === 'Team Lead' || t === 'Scrum' 
                  ? 'bg-purple-100/70 text-warm-accent border-purple-200' 
                  : 'bg-warm-hover text-warm-muted border-warm-border')}`}
        >
          {t}
        </span>
      ))}
    </div>
  </div>
);

export default HeroStage;