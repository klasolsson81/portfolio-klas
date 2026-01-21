import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Rocket, 
  Award, 
  Calendar,
  Code,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Users,
  Sparkles,
  ArrowUpDown,
  ExternalLink
} from 'lucide-react';

// =====================================================
// KONFIG: Typer och deras färger/ikoner
// =====================================================
const EVENT_TYPES = {
  education_start: {
    icon: GraduationCap,
    label: { sv: 'Utbildning startad', en: 'Education started' },
    colors: {
      dark: {
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30',
        text: 'text-cyan-400',
        glow: 'shadow-cyan-500/20',
        dot: 'bg-cyan-500'
      },
      light: {
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-400/40',
        text: 'text-cyan-700',
        glow: 'shadow-cyan-200/50',
        dot: 'bg-cyan-500'
      }
    }
  },
  course_complete: {
    icon: Award,
    label: { sv: 'Kurs avklarad', en: 'Course completed' },
    colors: {
      dark: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        text: 'text-green-400',
        glow: 'shadow-green-500/20',
        dot: 'bg-green-500'
      },
      light: {
        bg: 'bg-green-500/10',
        border: 'border-green-400/40',
        text: 'text-green-700',
        glow: 'shadow-green-200/50',
        dot: 'bg-green-500'
      }
    }
  },
  project: {
    icon: Rocket,
    label: { sv: 'Projekt lanserat', en: 'Project launched' },
    colors: {
      dark: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        glow: 'shadow-purple-500/20',
        dot: 'bg-purple-500'
      },
      light: {
        bg: 'bg-orange-500/10',
        border: 'border-orange-400/40',
        text: 'text-orange-700',
        glow: 'shadow-orange-200/50',
        dot: 'bg-orange-500'
      }
    }
  },
  skill: {
    icon: Code,
    label: { sv: 'Ny kunskap', en: 'New skill' },
    colors: {
      dark: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        glow: 'shadow-amber-500/20',
        dot: 'bg-amber-500'
      },
      light: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-400/40',
        text: 'text-amber-700',
        glow: 'shadow-amber-200/50',
        dot: 'bg-amber-500'
      }
    }
  },
  event: {
    icon: Users,
    label: { sv: 'Händelse', en: 'Event' },
    colors: {
      dark: {
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/30',
        text: 'text-slate-400',
        glow: 'shadow-slate-500/20',
        dot: 'bg-slate-500'
      },
      light: {
        bg: 'bg-slate-500/10',
        border: 'border-slate-400/40',
        text: 'text-slate-600',
        glow: 'shadow-slate-200/50',
        dot: 'bg-slate-400'
      }
    }
  },
  milestone: {
    icon: Sparkles,
    label: { sv: 'Milstolpe', en: 'Milestone' },
    colors: {
      dark: {
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/30',
        text: 'text-pink-400',
        glow: 'shadow-pink-500/20',
        dot: 'bg-pink-500'
      },
      light: {
        bg: 'bg-pink-500/10',
        border: 'border-pink-400/40',
        text: 'text-pink-700',
        glow: 'shadow-pink-200/50',
        dot: 'bg-pink-500'
      }
    }
  }
};

// =====================================================
// DATA: Alla 13 händelser (komplett lista)
// =====================================================
const TIMELINE_EVENTS = [
  {
    date: "2026-01-21",
    type: "project",
    title: { sv: "IFK Manager 2026 – Databashantering", en: "IFK Manager 2026 – Database Management" },
    description: {
      sv: "Ett omfattande managementsystem byggt i .NET 10 med SQL Server Express. Implementerade avancerad databaslogik med SQL-triggers för audit-loggning, repository-mönster och komplexa relationer via EF Core. Gränssnittet skapades med Spectre.Console för en modern terminalupplevelse.",
      en: "A comprehensive management system built in .NET 10 with SQL Server Express. Implemented advanced database logic using SQL triggers for audit logging, the repository pattern, and complex relations via EF Core. The interface was created with Spectre.Console for a modern terminal experience."
    },
    tags: ["C#", ".NET 10", "SQL Server", "EF Core", "Architecture", "Spectre.Console"],
    grade: "VG"
  },  
  {
    date: "2025-12-18",
    type: "course_complete",
    title: { sv: "OOP Grund – VG", en: "OOP Fundamentals – Distinction" },
    description: {
      sv: "Fördjupade mina kunskaper inom objektorienterad programmering med fokus på inkapsling, arv, polymorfism och abstraktion. Implementerade avancerade designmönster och SOLID-principer.",
      en: "Deepened my knowledge in object-oriented programming with focus on encapsulation, inheritance, polymorphism and abstraction. Implemented advanced design patterns and SOLID principles."
    },
    tags: ["C#", "OOP", ".NET", "Design Patterns", "SOLID"],
    grade: "VG"
  },
  {
    date: "2025-12-14",
    type: "project",
    title: { sv: "RECON - B2B Sales Intelligence", en: "RECON - B2B Sales Intelligence" },
    description: {
      sv: "AI-driven B2B-verktyg som analyserar företag i realtid och genererar säljinsikter. Omfattande kod-review, 70% snabbare sökningar, multi-provider arkitektur med automatisk fallback. Workshop med InFiNetCode AB.",
      en: "AI-powered B2B tool that analyzes companies in real-time and generates sales insights. Comprehensive code review, 70% faster searches, multi-provider architecture with automatic fallback. Workshop with InFiNetCode AB."
    },
    tags: ["AI", "Next.js", "TypeScript", "OpenAI", "B2B", "Tavily"],
    link: "https://recon.klasolsson.se"
  },
  {
    date: "2025-12-10",
    type: "project",
    title: { sv: "Sky High Adventures", en: "Sky High Adventures" },
    description: {
      sv: "Ett hjärteprojekt skapat för min 5-årige son Alexander. Ett webbaserat flygplansspel byggt med React och Phaser där familjen är piloter. Fokus på spelglädje och responsivitet.",
      en: "A passion project created for my 5-year-old son Alexander. A web-based airplane game built with React and Phaser where the family acts as pilots. Focus on fun and responsiveness."
    },
    tags: ["React", "Phaser", "Game Dev", "Family"],
    link: "https://skyadventuregame.klasolsson.se"
  },
  {
    date: "2025-11-29",
    type: "skill",
    title: { sv: "Första automationsflödet i n8n", en: "First n8n automation workflow" },
    description: {
      sv: "Byggde ett workflow som hämtar jobbannonser från Arbetsförmedlingen och postar automatiskt till Discord via webhook när nya annonser publiceras.",
      en: "Built a workflow that fetches job listings from Arbetsförmedlingen and automatically posts to Discord via webhook when new listings are published."
    },
    tags: ["n8n", "Docker", "API", "Automation"]
  },
  {
    date: "2025-11-23",
    type: "project",
    title: { sv: "Portfolio-hemsidan publicerad", en: "Portfolio website published" },
    description: {
      sv: "Lanserade min interaktiva portfolio med AI-chatbot, 3D-animationer och projekt-showcase. Mitt digitala visitkort mot världen.",
      en: "Launched my interactive portfolio with AI chatbot, 3D animations and project showcase. My digital business card to the world."
    },
    tags: ["React", "Three.js", "Tailwind", "OpenAI", "Vercel"]
  },
  {
    date: "2025-11-19",
    type: "event",
    title: { sv: "Studiebesök: Kognic", en: "Company visit: Kognic" },
    description: {
      sv: "Besökte Kognic i Göteborg för att lära oss om AI-driven datamärkning för autonoma fordon och träffa branschfolk.",
      en: "Visited Kognic in Gothenburg to learn about AI-powered data annotation for autonomous vehicles and meet industry professionals."
    },
    tags: ["AI", "Nätverk", "Industri"]
  },
  {
    date: "2025-10-25",
    type: "project",
    title: { sv: "Console Detective AI färdigt", en: "Console Detective AI completed" },
    description: {
      sv: "Avslutade mitt textbaserade noir-detektivspel med dynamiskt genererade mordgåtor via OpenAI. Mitt första större C#-projekt.",
      en: "Completed my text-based noir detective game with dynamically generated murder mysteries via OpenAI. My first major C# project."
    },
    tags: ["C#", ".NET", "OpenAI", "Spectre.Console"]
  },
  {
    date: "2025-10-22",
    type: "event",
    title: { sv: "Lindholmen Software Development Day", en: "Lindholmen Software Development Day" },
    description: {
      sv: "Deltog i mässa om mjukvaruutveckling på Lindholmen. Nätverkade med företag som Volvo, Ericsson och WirelessCar.",
      en: "Attended software development fair at Lindholmen. Networked with companies like Volvo, Ericsson and WirelessCar."
    },
    tags: ["Nätverk", "Industri", "Konferens"]
  },
  {
    date: "2025-09-26",
    type: "course_complete",
    title: { sv: "Onboarding avklarad", en: "Onboarding completed" },
    description: {
      sv: "Genomförde onboarding-kursen med fokus på gruppdynamik, presentationsteknik, kommunikation och självledarskap.",
      en: "Completed onboarding course focusing on group dynamics, presentation skills, communication and self-leadership."
    },
    tags: ["Kommunikation", "Teamwork", "Soft Skills"]
  },
  {
    date: "2025-09-23",
    type: "milestone",
    title: { sv: "Första hemsidan klar", en: "First website completed" },
    description: {
      sv: "Byggde min allra första portfolio-hemsida med enbart HTML och CSS. Startskottet för min resa som utvecklare.",
      en: "Built my very first portfolio website using only HTML and CSS. The starting point of my journey as a developer."
    },
    tags: ["HTML", "CSS", "Frontend"]
  },
  {
    date: "2025-09-19",
    type: "course_complete",
    title: { sv: "Introduktion till OOP – VG", en: "Introduction to OOP – Distinction" },
    description: {
      sv: "Avklarade kursen med högsta betyg. Lärde mig grunderna i objektorienterad programmering och designmönster i C#.",
      en: "Completed course with highest grade. Learned fundamentals of object-oriented programming and design patterns in C#."
    },
    tags: ["C#", "OOP", "Programmering"],
    grade: "VG"
  },
  {
    date: "2025-09-05",
    type: "course_complete",
    title: { sv: "Introduktion till Systemutveckling – VG", en: "Introduction to System Development – Distinction" },
    description: {
      sv: "Första kursen avklarad med högsta betyg! Fick en grundlig överblick av systemutvecklingsprocessen och Scrum.",
      en: "First course completed with highest grade! Got a thorough overview of the system development process and Scrum."
    },
    tags: ["Agile", "SDLC", "Scrum"],
    grade: "VG"
  },
  {
    date: "2025-08-25",
    type: "education_start",
    title: { sv: "YH-utbildningen började!", en: "Vocational education started!" },
    description: {
      sv: "Startade tvåårig YH-utbildning .NET Systemutveckling på NBI/Handelsakademin i Göteborg. En ny karriär tar form!",
      en: "Started two-year vocational education in .NET System Development at NBI/Handelsakademin in Gothenburg. A new career takes shape!"
    },
    tags: [".NET", "C#", "Utbildning"]
  }
];

// =====================================================
// HJÄLPFUNKTIONER
// =====================================================
const formatDate = (dateStr, lang) => {
  const date = new Date(dateStr);
  const months = {
    sv: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };
  return { month: months[lang][date.getMonth()], year: date.getFullYear() };
};

const getAllTags = (events) => {
  const tagSet = new Set();
  events.forEach(e => e.tags.forEach(t => tagSet.add(t)));
  return Array.from(tagSet).sort();
};

// =====================================================
// UNDERKOMPONENTER
// =====================================================
const TimelineEvent = ({ event, lang, isDark, index, totalDisplayed }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const typeConfig = EVENT_TYPES[event.type] || EVENT_TYPES.event;
  const Icon = typeConfig.icon;
  const colors = isDark ? typeConfig.colors.dark : typeConfig.colors.light;
  const { month, year } = formatDate(event.date, lang);

  // Beräkna en mjukare stagger-fördröjning
  // Vi vill att nyligen tillagda element (längst ner) ska ha en tydlig sekvens
  const staggerDelay = (index % 5) * 0.15;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ 
        delay: staggerDelay, 
        duration: 0.5,
        ease: "easeOut" 
      }}
      className="relative pl-8 md:pl-12 pb-8 last:pb-0"
    >
      {/* Tidslinje-linje */}
      <div className={`absolute left-[11px] md:left-[19px] top-8 bottom-0 w-0.5 ${isDark ? 'bg-white/10' : 'bg-orange-200/50'}`} />
      
      {/* Tidslinje-punkt */}
      <div className={`absolute left-0 md:left-2 top-1 w-6 h-6 rounded-full ${colors.dot} flex items-center justify-center ring-4 ${isDark ? 'ring-[#0a0b1e]' : 'ring-orange-50/50'}`}>
        <Icon size={12} className="text-white" />
      </div>

      {/* Kort */}
      <div
        className={`rounded-xl border backdrop-blur-sm ${colors.bg} ${colors.border} ${colors.glow} shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.01]`}
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
      >
        <div className="p-4 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-xs font-mono ${isDark ? 'text-gray-500' : 'text-warm-accent'}`}>{month} {year}</span>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                  {typeConfig.label[lang]}
                </span>
                {event.grade && (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold bg-green-500 text-white">
                    {event.grade}
                  </span>
                )}
              </div>
              <h3 className={`font-bold text-base md:text-lg ${isDark ? 'text-white' : 'text-warm-text'}`}>
                {event.title[lang]}
              </h3>
            </div>
            <button className={`p-1 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-orange-100/50'}`}>
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {event.tags.map(tag => (
              <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${isDark ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-orange-50/30 text-warm-accent border border-orange-200/50'}`}>
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className={`px-4 md:px-5 pb-5 pt-0 border-t ${isDark ? 'border-white/5' : 'border-orange-200/30'}`}>
                <p className={`text-sm leading-relaxed pt-4 ${isDark ? 'text-gray-300' : 'text-warm-muted'}`}>
                  {event.description[lang]}
                </p>
                {event.link && (
                  <div className="pt-4">
                    <a 
                      href={event.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all ${isDark ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20' : 'bg-cyan-100 text-cyan-700 border border-cyan-200 hover:bg-cyan-200'}`} 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={14} />
                      {lang === 'sv' ? 'Se projektet' : 'View Project'}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// =====================================================
// HUVUDKOMPONENT
// =====================================================
const DevTimeline = ({ lang, isDark }) => {
  const [activeFilters, setActiveFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [sortOrder, setSortOrder] = useState('newest');
  const loaderRef = useRef(null);

  const allTags = useMemo(() => getAllTags(TIMELINE_EVENTS), []);

  const filteredEvents = useMemo(() => {
    let events = TIMELINE_EVENTS;
    if (activeFilters.length > 0) {
      events = events.filter(event => activeFilters.some(filter => event.tags.includes(filter)));
    }
    return [...events].sort((a, b) => {
      const dateA = new Date(a.date), dateB = new Date(b.date);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [activeFilters, sortOrder]);

  const displayedEvents = filteredEvents.slice(0, visibleCount);

  // Mjuk Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && visibleCount < filteredEvents.length) {
        // Vi laddar in lite i taget för snyggare animation
        setTimeout(() => {
          setVisibleCount(prev => Math.min(prev + 3, filteredEvents.length));
        }, 400); // Ökad fördröjning för "lugnare" känsla
      }
    }, { threshold: 0.1 });
    
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [visibleCount, filteredEvents.length]);

  const toggleFilter = (tag) => {
    setActiveFilters(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    setVisibleCount(10);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
    setVisibleCount(10);
  };

  const t = {
    title: { sv: 'Min resa', en: 'My Journey' },
    subtitle: { sv: 'Utbildning, projekt & milstolpar', en: 'Education, projects & milestones' },
    filter: { sv: 'Filtrera', en: 'Filter' },
    newest: { sv: 'Nyast först', en: 'Newest first' },
    oldest: { sv: 'Äldst först', en: 'Oldest first' },
    clearFilters: { sv: 'Rensa filter', en: 'Clear filters' },
    noResults: { sv: 'Inga händelser matchar filtret', en: 'No events match the filter' }
  };

  return (
    <div className="md:flex-1 md:min-h-0 flex flex-col">
      {/* Header */}
      <div className="shrink-0 mb-4">
        <h2 className={`text-xl md:text-2xl font-bold mb-1 ${isDark ? 'text-neon-purple' : 'text-warm-accent'}`}>
          {t.title[lang]}
        </h2>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-warm-accent'}`}>
          {t.subtitle[lang]}
        </p>
      </div>

      {/* Kontroller */}
      <div className="shrink-0 mb-4 flex flex-wrap gap-2">
        <button 
          onClick={() => setShowFilters(!showFilters)} 
          className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-all ${isDark ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-orange-50/30 text-warm-text border border-orange-200/50 hover:bg-orange-50/50'}`}
        >
          <Filter size={16} /> {t.filter[lang]}
          {activeFilters.length > 0 && <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-neon-purple text-white">{activeFilters.length}</span>}
        </button>
        <button 
          onClick={toggleSortOrder} 
          className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-all ${isDark ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-orange-50/30 text-warm-text border border-orange-200/50 hover:bg-orange-50/50'}`}
        >
          <ArrowUpDown size={16} /> {sortOrder === 'newest' ? t.newest[lang] : t.oldest[lang]}
        </button>
      </div>

      {/* Filter Chips */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="shrink-0 overflow-hidden">
            <div className="flex flex-wrap gap-2 mb-4 pb-2">
              {allTags.map(tag => (
                <button 
                  key={tag} 
                  onClick={() => toggleFilter(tag)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${activeFilters.includes(tag) ? (isDark ? 'bg-neon-purple text-white shadow-lg' : 'bg-warm-accent text-white shadow-lg') : (isDark ? 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10' : 'bg-orange-50/30 text-warm-accent border border-orange-200/50')}`}
                >
                  #{tag}
                </button>
              ))}
              {activeFilters.length > 0 && (
                <button onClick={() => {setActiveFilters([]); setVisibleCount(10);}} className="text-xs px-3 py-1.5 rounded-full text-red-400 hover:bg-red-500/10 flex items-center gap-1">
                  <X size={12} /> {t.clearFilters[lang]}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tidslinje Scroll-area */}
      <div className="md:flex-1 md:min-h-0 md:overflow-y-auto md:pr-2 custom-scrollbar">
        {displayedEvents.length > 0 ? (
          <>
            <AnimatePresence mode="popLayout">
              {displayedEvents.map((event, index) => (
                <TimelineEvent 
                  key={`${event.date}-${event.title.sv}`} 
                  event={event} 
                  lang={lang} 
                  isDark={isDark} 
                  index={index} 
                  totalDisplayed={displayedEvents.length}
                />
              ))}
            </AnimatePresence>
            
            {/* Laddnings-vakt */}
            {visibleCount < filteredEvents.length && (
              <div ref={loaderRef} className="py-12 flex flex-col items-center gap-2">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
                  transition={{ repeat: Infinity, duration: 1.5 }} 
                  className={`w-3 h-3 rounded-full ${isDark ? 'bg-neon-purple' : 'bg-warm-accent'}`} 
                />
                <span className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-gray-600' : 'text-warm-muted'}`}>
                  Laddar fler händelser...
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p>{t.noResults[lang]}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevTimeline;