import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfilePhoto from './ProfilePhoto';
import ChatUI from './ChatUI';
import { Code, Terminal, User, Github, Linkedin, Mail, Languages, ExternalLink, Play, X, Download, Layers, Briefcase, Moon, Sun, TrendingUp, Rocket } from 'lucide-react';
import GithubStats from './GithubStats';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import ProjectSlideshow from './ProjectSlideshow';
import HireMe from './HireMe';
import DevTimeline from './DevTimeline';

// Data imports
import { PROJECT_SLIDES, detectiveVideo } from './data/projectSlides.jsx';
import { TRANSLATIONS, calculateAge } from './data/translations';

const HeroStage = ({ isDark, toggleTheme, lang, toggleLang }) => {
  const [section, setSection] = useState('about');
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeSlideshow, setActiveSlideshow] = useState(null);

  const t = TRANSLATIONS[lang];
  const myAge = calculateAge('1981-02-04');
  // Lägg till dessa varianter för staggered animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 } // Vänta 0.2s mellan varje rad
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

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
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-10 text-white hover:text-neon-cyan bg-black/50 rounded-full p-2 transition-colors"
                aria-label="Stäng video"
              >
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
  className={`w-full max-w-7xl rounded-2xl md:rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row md:max-h-[88vh] md:h-full transition-all duration-500 relative z-10
    ${isDark
      ? 'bg-neon-darkbg/80 backdrop-blur-xl border border-white/10 shadow-2xl'
      : 'bg-orange-50/50 backdrop-blur-2xl border border-orange-200/50 shadow-xl shadow-orange-400/10'}`}
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
                aria-label={isDark ? 'Byt till ljust tema' : 'Byt till mörkt tema'}
              >
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
              </button>
              <button
                onClick={toggleLang}
                className={`w-8 h-8 rounded-full border flex items-center justify-center overflow-hidden
                  ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/60 border-warm-border'}`}
                aria-label={lang === 'sv' ? 'Switch to English' : 'Byt till svenska'}
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
                    : 'bg-orange-100/70 border border-orange-200 text-warm-accent'}`}
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
            ${isDark ? 'border-white/10 bg-black/20' : 'border-orange-200/30 bg-orange-50/20'}`}
        >          
          <div className="flex w-full justify-end gap-3 mb-2 relative z-20">
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center w-8 h-8 rounded-full border transition-colors shadow-sm
                ${isDark
                  ? 'text-gray-400 hover:text-neon-cyan bg-black/40 border-white/10'
                  : 'text-warm-muted hover:text-warm-accent bg-white/60 border-warm-border hover:border-warm-accent/30'}`}
              aria-label={isDark ? 'Byt till ljust tema' : 'Byt till mörkt tema'}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              onClick={toggleLang}
              className={`flex items-center justify-center w-8 h-8 rounded-full border transition-colors shadow-sm hover:scale-105 active:scale-95 overflow-hidden
                ${isDark
                  ? 'bg-black/40 border-white/10'
                  : 'bg-white/60 border-warm-border'}`}
              aria-label={lang === 'sv' ? 'Switch to English' : 'Byt till svenska'}
            >
              <span className={`fi fi-${lang === 'sv' ? 'se' : 'gb'} fis text-lg`}></span>
            </button>
          </div>

          <div className={`absolute inset-0 pointer-events-none
            ${isDark
              ? 'bg-gradient-to-br from-neon-purple/10 to-transparent'
              : 'bg-gradient-to-br from-orange-100/30 via-transparent to-amber-50/20'}`}
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
                  : 'bg-orange-100/70 border border-orange-200 text-warm-accent hover:bg-orange-100 hover:border-warm-accent'}`}
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
            ${isDark ? 'bg-black/30' : 'bg-orange-50/20'}`}
        >
          <AnimatePresence mode="wait">
            

{section === 'about' && (
  <motion.div 
    key="about" 
    variants={containerVariants} // AKTIVERAR ANIMATIONEN
    initial="hidden"
    animate="visible"
    exit="hidden"
    className="space-y-6 md:overflow-y-auto md:pr-2 custom-scrollbar md:h-full"
  >
<motion.h2 
  variants={itemVariants} 
  className={`text-xl md:text-2xl font-bold mb-4 ${isDark ? 'animate-subtitle-shimmer' : 'light-subtitle-shimmer'}`}
>
  {t.titles.whoami}
</motion.h2>

    <div className={`space-y-4 leading-relaxed text-sm md:text-base ${isDark ? 'text-gray-300' : 'text-warm-muted'}`}>
      <motion.p variants={itemVariants}>
        <span className={`font-bold ${isDark ? 'text-white' : 'text-warm-text'}`}>
          {/* DELAR NU VID PUNKT+MELLANSLAG FÖR ATT KLARA .NET */}
          {t.about.intro1.split('. ')[0]}.
        </span>
        {' '}{t.about.intro1.split('. ').slice(1).join('. ')}
      </motion.p>
      
      <motion.p 
        variants={itemVariants}
        dangerouslySetInnerHTML={{ __html: t.about.intro2.replace('n8n', `<span class="${isDark ? 'text-neon-cyan' : 'text-warm-accent'} font-semibold">n8n</span>`) }} 
      />
    </div>
    

                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t ${isDark ? 'border-white/10' : 'border-warm-border'}`}>
                  <div>
<h3 className={`text-xs font-bold mb-3 uppercase tracking-widest ${isDark ? 'animate-section-gradient' : 'light-section-gradient'}`}>
  {t.about.factsTitle}
</h3>
                    <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-warm-muted'}`}>
                      <li className="flex items-baseline gap-2">
                        <span className={`${isDark ? 'text-neon-purple' : 'text-warm-accent'}`}>➤</span>
                        <span className={`font-semibold min-w-[60px] ${isDark ? 'text-gray-400' : 'text-warm-muted'}`}>
                          {t.about.facts.age}:
                        </span>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-warm-text'}`}>
                          {myAge}
                        </span>
                      </li>
                      <li className="flex items-baseline gap-2">
                        <span className={`${isDark ? 'text-neon-purple' : 'text-warm-accent'}`}>➤</span>
                        <span className={`font-semibold min-w-[60px] ${isDark ? 'text-gray-400' : 'text-warm-muted'}`}>
                          {t.about.facts.city}:
                        </span>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-warm-text'}`}>
                          {t.about.factValues.city}
                        </span>
                      </li>
                      <li className="flex items-baseline gap-2">
                        <span className={`${isDark ? 'text-neon-purple' : 'text-warm-accent'}`}>➤</span>
                        <span className={`font-semibold min-w-[60px] ${isDark ? 'text-gray-400' : 'text-warm-muted'}`}>
                          {t.about.facts.lang}:
                        </span>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-warm-text'}`}>
                          {t.about.factValues.lang}
                        </span>
                      </li>
                      <li className="flex items-baseline gap-2">
                        <span className={`${isDark ? 'text-neon-purple' : 'text-warm-accent'}`}>➤</span>
                        <span className={`font-semibold min-w-[60px] ${isDark ? 'text-gray-400' : 'text-warm-muted'}`}>
                          {t.about.facts.family}:
                        </span>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-warm-text'}`}>
                          {t.about.factValues.family}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
<h3 className={`text-xs font-bold mb-3 uppercase tracking-widest ${isDark ? 'animate-section-gradient' : 'light-section-gradient'}`}>
  {t.about.stackTitle}
</h3>
                    <div className="flex flex-wrap gap-2">
                      {['C#', '.NET 8', 'SQL Server', 'Entity Framework', 'React', 'Three.js', 'Tailwind CSS', 'Framer Motion', 'Vite', 'Vercel', 'Azure', 'Docker', 'Git', 'n8n', 'AI Integration'].map(tag => (
                        <span
                          key={tag}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono cursor-default transition-all duration-200 hover:scale-105 active:scale-95
                            ${isDark
                              ? 'bg-neon-purple/10 border border-neon-purple/30 text-neon-cyan hover:bg-neon-purple/20 hover:shadow-md'
                              : 'bg-orange-100/70 border border-orange-200 text-warm-accent hover:bg-orange-100 hover:shadow-sm'}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <GithubStats isDark={isDark} lang={lang} />
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
                className="space-y-6 md:overflow-y-auto md:pr-2 custom-scrollbar md:h-full"
              >
                <h2 className={`text-xl md:text-2xl font-bold mb-2 ${isDark ? 'text-neon-purple' : 'text-warm-accent'}`}>
                  {t.titles.projects}
                </h2>

                {/* LIVE DEMOS - Featured Projects */}
                <div className="space-y-6">
                  <h3 className={`text-sm uppercase tracking-wider font-bold flex items-center gap-2 ${isDark ? 'text-neon-cyan' : 'text-warm-accent'}`}>
                    <span>🚀</span>
                    {lang === 'sv' ? 'Live Demos' : 'Live Demos'}
                  </h3>

                  <LiveDemoCard
                    title="RECON - B2B Sales Intelligence"
                    desc={lang === 'sv'
                      ? "AI-driven B2B-analys som genererar säljinsikter i realtid. 70% snabbare än traditionella verktyg med multi-provider arkitektur."
                      : "AI-powered B2B analysis generating sales insights in real-time. 70% faster than traditional tools with multi-provider architecture."}
                    tags={['Next.js', 'TypeScript', 'OpenAI', 'Tavily API', 'Vercel']}
                    demoUrl="https://recon.klasolsson.se"
                    githubUrl="https://github.com/klasolsson81/CheatSheet"
                    image="/recon-screenshot.png"
                    onDetails={() => setActiveSlideshow({ title: "RECON - B2B Sales Intelligence", slides: PROJECT_SLIDES.recon })}
                    isDark={isDark}
                    lang={lang}
                  />

                  <LiveDemoCard
                    title="Sky High Adventures"
                    desc={lang === 'sv'
                      ? "Ett fartfyllt flygspel utvecklat med React och Phaser 3. Styr din pilot genom himlen, samla stjärnor och undvik hinder!"
                      : "Fast-paced flight game built with React and Phaser 3. Control your pilot through the sky, collect stars and avoid obstacles!"}
                    tags={['React', 'Phaser 3', 'Vite', 'JavaScript', 'Game Dev']}
                    demoUrl="https://skyadventuregame.klasolsson.se/"
                    githubUrl="https://github.com/klasolsson81/sky-adventure-game"
                    image="/skyhigh-screenshot.png"
                    isDark={isDark}
                    lang={lang}
                  />
                </div>

                {/* CODE DEEP DIVES - Project Breakdowns */}
                <div className={`space-y-6 pt-8 mt-6 border-t-2 ${isDark ? 'border-white/20' : 'border-orange-300/60'}`}>
                  <h3 className={`text-sm uppercase tracking-wider font-bold flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-warm-muted'}`}>
                    <span>💻</span>
                    {lang === 'sv' ? 'Koddjupdykningar' : 'Code Deep Dives'}
                  </h3>

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
    className={`relative w-full flex flex-row items-center justify-start gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group overflow-hidden
      ${active
        ? isDark
          ? 'bg-neon-purple/20 text-white border-l-4 border-neon-purple shadow-lg'
          : 'bg-orange-100/70 text-warm-text border-l-4 border-warm-accent shadow-md'
        : isDark
          ? 'text-gray-300 hover:bg-white/10 hover:text-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
          : 'text-warm-text/70 hover:bg-warm-hover hover:text-warm-text hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]'}
    `}
  >
    {/* Subtle gradient overlay on hover (not AI-typical) */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
      ${isDark
        ? 'bg-gradient-to-r from-white/5 to-transparent'
        : 'bg-gradient-to-r from-orange-50/50 to-transparent'}`}
    />

    <span className={`relative z-10 transition-all duration-300 ${active
      ? isDark ? 'text-neon-cyan scale-110' : 'text-warm-accent scale-110'
      : isDark ? 'group-hover:text-white group-hover:scale-110 group-hover:rotate-3' : 'group-hover:text-warm-accent group-hover:scale-110 group-hover:rotate-3'}`}>
      {React.cloneElement(icon, { size: 16 })}
    </span>
    <span className={`relative z-10 ${active ? 'font-bold' : 'font-medium group-hover:font-semibold'}`}>{label}</span>
  </button>
);

// Mobil NavButton - kompakt utan truncate
const MobileNavButton = ({ label, icon, active, onClick, isDark, isHire }) => (
  <button
    onClick={onClick}
    className={`relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg text-[10px] font-medium transition-all duration-300 group overflow-hidden
      ${active
        ? isDark
          ? 'bg-neon-purple/20 text-white shadow-md scale-105'
          : 'bg-orange-100/70 text-warm-text shadow-sm scale-105'
        : isDark
          ? 'text-gray-300 hover:bg-white/10 hover:text-white active:scale-95'
          : 'text-warm-text/70 hover:bg-warm-hover hover:text-warm-text active:scale-95'}
    `}
  >
    {/* Subtle background glow on active */}
    {active && (
      <div className={`absolute inset-0 blur-sm opacity-50 pointer-events-none
        ${isDark ? 'bg-neon-purple/10' : 'bg-orange-200/30'}`}
      />
    )}

    <span className={`relative z-10 transition-all duration-300 ${active
      ? isDark ? 'text-neon-cyan scale-110' : 'text-warm-accent scale-110'
      : 'group-hover:scale-110 group-hover:rotate-6'}`}>
      {icon}
    </span>
    <span className={`relative z-10 text-center whitespace-nowrap ${active ? 'font-bold' : 'font-medium'} ${isHire && !active
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
          : 'bg-orange-100/70 text-warm-text border-l-2 border-warm-accent'
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
  <div className={`p-5 rounded-xl border-2 transition-all group relative shadow-xl
    ${isDark
      ? 'bg-gradient-to-br from-white/5 to-transparent border-white/20 hover:border-neon-cyan/60 hover:shadow-neon-cyan/30'
      : 'bg-orange-50/60 border-orange-300/70 hover:border-warm-accent/70 hover:shadow-warm-accent/20'}`}>
      
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
              : 'bg-orange-100/70 text-warm-accent border-orange-200 hover:bg-warm-accent hover:text-white'}`}
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
                  ? 'bg-orange-100/70 text-warm-accent border-orange-200'
                  : 'bg-warm-hover text-warm-muted border-warm-border')}`}
        >
          {t}
        </span>
      ))}
    </div>
  </div>
);

// LiveDemoCard - Featured project card with screenshot and demo link
const LiveDemoCard = ({ title, desc, tags, demoUrl, githubUrl, image, onDetails, isDark, lang }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <>
      <div
        className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02] cursor-pointer
          ${isDark
            ? 'bg-gradient-to-br from-white/5 to-transparent border-white/20 hover:border-neon-cyan/60 shadow-xl hover:shadow-neon-cyan/30'
            : 'bg-gradient-to-br from-orange-50/80 to-amber-50/60 border-orange-300/70 hover:border-warm-accent/70 shadow-lg hover:shadow-warm-accent/20'}`}
        onClick={() => setIsExpanded(true)}
      >

    {/* Screenshot/Image */}
    <div className={`relative h-40 md:h-48 overflow-hidden ${isDark ? 'bg-black/40' : 'bg-orange-100/50'}`}>
      {image ? (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div className={`absolute inset-0 flex items-center justify-center ${image ? 'hidden' : 'flex'}`}>
        <Rocket className={`w-16 h-16 ${isDark ? 'text-neon-purple/30' : 'text-warm-accent/30'}`} />
      </div>

      {/* Overlay gradient */}
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-black/60 to-transparent' : 'bg-gradient-to-t from-orange-50/60 to-transparent'}`} />
    </div>

    {/* Content */}
    <div className="p-4 md:p-5">
      <h3 className={`font-bold text-base md:text-lg mb-2 transition-colors
        ${isDark ? 'text-white group-hover:text-neon-cyan' : 'text-warm-text group-hover:text-warm-accent'}`}>
        {title}
      </h3>

      <p className={`text-xs md:text-sm leading-relaxed mb-3
        ${isDark ? 'text-gray-300' : 'text-warm-muted'}`}>
        {desc}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-3">
        <a
          href={demoUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all shadow-md hover:shadow-lg hover:scale-105
            ${isDark
              ? 'bg-neon-purple text-white hover:bg-neon-purple/80'
              : 'bg-warm-accent text-white hover:bg-warm-accentDark'}`}
        >
          <Rocket size={16} />
          {lang === 'sv' ? 'Öppna Live Demo' : 'Open Live Demo'}
        </a>

        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium border transition-all hover:scale-105
            ${isDark
              ? 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white'
              : 'bg-orange-50/50 border-orange-200 text-warm-muted hover:bg-orange-100 hover:text-warm-text'}`}
        >
          <Github size={16} />
          {lang === 'sv' ? 'Kod' : 'Code'}
        </a>

        {onDetails && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDetails();
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium border transition-all hover:scale-105
              ${isDark
                ? 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white'
                : 'bg-orange-50/50 border-orange-200 text-warm-muted hover:bg-orange-100 hover:text-warm-text'}`}
          >
            <Code size={16} />
            {lang === 'sv' ? 'Djupdykning' : 'Deep Dive'}
          </button>
        )}
      </div>

      {/* Tech Stack Tags */}
      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <span
            key={tag}
            className={`text-[10px] px-2 py-1 rounded-md font-mono
              ${isDark
                ? 'bg-black/40 text-gray-400 border border-white/10'
                : 'bg-orange-100/50 text-warm-accent border border-orange-200/50'}`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Click hint */}
      <div className={`mt-3 text-center text-[10px] ${isDark ? 'text-gray-500' : 'text-warm-accent/60'}`}>
        👆 {lang === 'sv' ? 'Klicka för större vy' : 'Click for larger view'}
      </div>
    </div>
  </div>

  {/* Expanded Modal */}
  {isExpanded && (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={() => setIsExpanded(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`relative w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border
          ${isDark
            ? 'bg-[#0a0b1e] border-white/10'
            : 'bg-orange-50/95 backdrop-blur-xl border-orange-200/50'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setIsExpanded(false)}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all hover:scale-110
            ${isDark
              ? 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white'
              : 'bg-orange-100 hover:bg-orange-200 text-warm-accent hover:text-warm-text'}`}
          aria-label={lang === 'sv' ? 'Stäng' : 'Close'}
        >
          <X size={24} />
        </button>

        {/* Large screenshot */}
        <div className={`relative h-64 md:h-80 overflow-hidden ${isDark ? 'bg-black/40' : 'bg-orange-100/50'}`}>
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Rocket className={`w-24 h-24 ${isDark ? 'text-neon-purple/30' : 'text-warm-accent/30'}`} />
            </div>
          )}
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-black/60 to-transparent' : 'bg-gradient-to-t from-orange-50/60 to-transparent'}`} />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4
            ${isDark ? 'text-white' : 'text-warm-text'}`}>
            {title}
          </h2>

          <p className={`text-base md:text-lg leading-relaxed mb-6
            ${isDark ? 'text-gray-300' : 'text-warm-muted'}`}>
            {desc}
          </p>

          {/* Large Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <a
              href={demoUrl}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-base font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105
                ${isDark
                  ? 'bg-neon-purple text-white hover:bg-neon-purple/80'
                  : 'bg-warm-accent text-white hover:bg-warm-accentDark'}`}
            >
              <Rocket size={20} />
              {lang === 'sv' ? 'Öppna Live Demo' : 'Open Live Demo'}
            </a>

            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-base font-medium border transition-all hover:scale-105
                ${isDark
                  ? 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white'
                  : 'bg-orange-50/50 border-orange-200 text-warm-muted hover:bg-orange-100 hover:text-warm-text'}`}
            >
              <Github size={20} />
              {lang === 'sv' ? 'Visa Kod' : 'View Code'}
            </a>

            {onDetails && (
              <button
                onClick={onDetails}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl text-base font-medium border transition-all hover:scale-105
                  ${isDark
                    ? 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white'
                    : 'bg-orange-50/50 border-orange-200 text-warm-muted hover:bg-orange-100 hover:text-warm-text'}`}
              >
                <Code size={20} />
                {lang === 'sv' ? 'Teknisk Djupdykning' : 'Technical Deep Dive'}
              </button>
            )}
          </div>

          {/* Tech Stack Tags - Larger */}
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className={`text-sm px-3 py-1.5 rounded-lg font-mono
                  ${isDark
                    ? 'bg-black/40 text-gray-300 border border-white/10'
                    : 'bg-orange-100/50 text-warm-accent border border-orange-200/50'}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )}
</>
  );
};

export default HeroStage;