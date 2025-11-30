import React, { useState, useMemo } from 'react';
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
  Sparkles
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
        bg: 'bg-cyan-50',
        border: 'border-cyan-200',
        text: 'text-cyan-700',
        glow: 'shadow-cyan-200',
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
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        glow: 'shadow-green-200',
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
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        glow: 'shadow-purple-200',
        dot: 'bg-purple-500'
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
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-700',
        glow: 'shadow-amber-200',
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
        bg: 'bg-slate-100',
        border: 'border-slate-200',
        text: 'text-slate-600',
        glow: 'shadow-slate-200',
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
        bg: 'bg-pink-50',
        border: 'border-pink-200',
        text: 'text-pink-700',
        glow: 'shadow-pink-200',
        dot: 'bg-pink-500'
      }
    }
  }
};

// =====================================================
// DATA: Lägg till nya händelser här! (nyast först)
// =====================================================
const TIMELINE_EVENTS = [
  {
    date: "2025-11-29",
    type: "skill",
    title: { 
      sv: "Första automationsflödet i n8n", 
      en: "First n8n automation workflow" 
    },
    description: { 
      sv: "Byggde ett workflow som hämtar jobbannonser från Arbetsförmedlingen och postar automatiskt till Discord via webhook när nya annonser publiceras.",
      en: "Built a workflow that fetches job listings from Arbetsförmedlingen and automatically posts to Discord via webhook when new listings are published."
    },
    tags: ["n8n", "Docker", "API", "Automation"]
  },
  {
    date: "2025-11-23",
    type: "project",
    title: { 
      sv: "Portfolio-hemsidan publicerad", 
      en: "Portfolio website published" 
    },
    description: { 
      sv: "Lanserade min interaktiva portfolio med AI-chatbot, 3D-animationer och projekt-showcase. Ett ständigt pågående projekt.",
      en: "Launched my interactive portfolio with AI chatbot, 3D animations and project showcase. An ongoing project."
    },
    tags: ["React", "Three.js", "Tailwind", "OpenAI", "Vercel"]
  },
  {
    date: "2025-11-19",
    type: "event",
    title: { 
      sv: "Studiebesök: Kognic", 
      en: "Company visit: Kognic" 
    },
    description: { 
      sv: "Besökte Kognic i Göteborg för att lära oss om AI-driven datamärkning för autonoma fordon.",
      en: "Visited Kognic in Gothenburg to learn about AI-powered data annotation for autonomous vehicles."
    },
    tags: ["AI", "Nätverk", "Industri"]
  },
  {
    date: "2025-10-25",
    type: "project",
    title: { 
      sv: "Console Detective AI färdigt", 
      en: "Console Detective AI completed" 
    },
    description: { 
      sv: "Avslutade mitt textbaserade noir-detektivspel med dynamiskt genererade mordgåtor via OpenAI. Mitt första större C#-projekt.",
      en: "Completed my text-based noir detective game with dynamically generated murder mysteries via OpenAI. My first major C# project."
    },
    tags: ["C#", ".NET", "OpenAI", "Spectre.Console"]
  },
  {
    date: "2025-10-22",
    type: "event",
    title: { 
      sv: "Lindholmen Software Development Day", 
      en: "Lindholmen Software Development Day" 
    },
    description: { 
      sv: "Deltog i mässa om mjukvaruutveckling på Lindholmen. Nätverkade och lärde mig om branschtrender.",
      en: "Attended software development fair at Lindholmen. Networked and learned about industry trends."
    },
    tags: ["Nätverk", "Industri", "Konferens"]
  },
  {
    date: "2025-09-26",
    type: "course_complete",
    title: { 
      sv: "Onboarding avklarad", 
      en: "Onboarding completed" 
    },
    description: { 
      sv: "Genomförde onboarding-kursen med fokus på gruppdynamik, presentationsteknik, kommunikation och självledarskap.",
      en: "Completed onboarding course focusing on group dynamics, presentation skills, communication and self-leadership."
    },
    tags: ["Kommunikation", "Teamwork", "Soft Skills"]
  },
  {
    date: "2025-09-23",
    type: "milestone",
    title: { 
      sv: "Första hemsidan klar", 
      en: "First website completed" 
    },
    description: { 
      sv: "Byggde min allra första portfolio-hemsida med enbart HTML och CSS. Startskottet för frontend-resan!",
      en: "Built my very first portfolio website using only HTML and CSS. The start of my frontend journey!"
    },
    tags: ["HTML", "CSS", "Frontend"]
  },
  {
    date: "2025-09-19",
    type: "course_complete",
    title: { 
      sv: "Introduktion till OOP – VG", 
      en: "Introduction to OOP – Distinction" 
    },
    description: { 
      sv: "Avklarade kursen med högsta betyg. Lärde mig grunderna i objektorienterad programmering och designmönster.",
      en: "Completed course with highest grade. Learned fundamentals of object-oriented programming and design patterns."
    },
    tags: ["C#", "OOP", "Programmering"],
    grade: "VG"
  },
  {
    date: "2025-09-05",
    type: "course_complete",
    title: { 
      sv: "Introduktion till Systemutveckling – VG", 
      en: "Introduction to System Development – Distinction" 
    },
    description: { 
      sv: "Första kursen avklarad med högsta betyg! Fick en överblick av systemutvecklingsprocessen och agila metoder.",
      en: "First course completed with highest grade! Got an overview of system development processes and agile methods."
    },
    tags: ["Agile", "SDLC", "Scrum"],
    grade: "VG"
  },
  {
    date: "2025-08-25",
    type: "education_start",
    title: { 
      sv: "YH-utbildningen började!", 
      en: "Vocational education started!" 
    },
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
  return {
    month: months[lang][date.getMonth()],
    year: date.getFullYear()
  };
};

// Extrahera alla unika tags
const getAllTags = (events) => {
  const tagSet = new Set();
  events.forEach(e => e.tags.forEach(t => tagSet.add(t)));
  return Array.from(tagSet).sort();
};

// =====================================================
// KOMPONENTER
// =====================================================
const TimelineEvent = ({ event, lang, isDark, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const typeConfig = EVENT_TYPES[event.type] || EVENT_TYPES.event;
  const Icon = typeConfig.icon;
  const colors = isDark ? typeConfig.colors.dark : typeConfig.colors.light;
  const { month, year } = formatDate(event.date, lang);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="relative pl-8 md:pl-12 pb-8 last:pb-0"
    >
      {/* Tidslinje-linje */}
      <div className={`absolute left-[11px] md:left-[19px] top-8 bottom-0 w-0.5 ${isDark ? 'bg-white/10' : 'bg-warm-border'}`} />
      
      {/* Tidslinje-punkt */}
      <div className={`absolute left-0 md:left-2 top-1 w-6 h-6 rounded-full ${colors.dot} flex items-center justify-center ring-4 ${isDark ? 'ring-neon-darkbg' : 'ring-warm-bg'}`}>
        <Icon size={12} className="text-white" />
      </div>

      {/* Kort */}
      <div 
        className={`rounded-xl border ${colors.bg} ${colors.border} ${colors.glow} shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.01]`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Header */}
        <div className="p-4 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Datum & typ-badge */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-xs font-mono ${isDark ? 'text-gray-500' : 'text-warm-subtle'}`}>
                  {month} {year}
                </span>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                  {typeConfig.label[lang]}
                </span>
                {event.grade && (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold bg-green-500 text-white">
                    {event.grade}
                  </span>
                )}
              </div>
              
              {/* Titel */}
              <h3 className={`font-bold text-base md:text-lg ${isDark ? 'text-white' : 'text-warm-text'}`}>
                {event.title[lang]}
              </h3>
            </div>

            {/* Expand-ikon */}
            <button className={`p-1 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
              {isExpanded 
                ? <ChevronUp size={18} className={isDark ? 'text-gray-400' : 'text-warm-muted'} />
                : <ChevronDown size={18} className={isDark ? 'text-gray-400' : 'text-warm-muted'} />
              }
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {event.tags.map(tag => (
              <span 
                key={tag} 
                className={`text-[10px] px-2 py-0.5 rounded-md font-mono transition-colors
                  ${isDark 
                    ? 'bg-white/5 text-gray-400 border border-white/10' 
                    : 'bg-warm-hover text-warm-muted border border-warm-border'}`}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Expanderad beskrivning */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className={`px-4 md:px-5 pb-4 md:pb-5 pt-0 border-t ${isDark ? 'border-white/5' : 'border-warm-border/50'}`}>
                <p className={`text-sm leading-relaxed pt-4 ${isDark ? 'text-gray-300' : 'text-warm-muted'}`}>
                  {event.description[lang]}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const FilterChip = ({ tag, isActive, onClick, isDark }) => (
  <button
    onClick={onClick}
    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 ${
      isActive
        ? isDark 
          ? 'bg-neon-purple text-white shadow-lg shadow-neon-purple/30' 
          : 'bg-warm-accent text-white shadow-lg shadow-warm-accent/30'
        : isDark
          ? 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
          : 'bg-warm-hover text-warm-muted border border-warm-border hover:bg-warm-active hover:text-warm-text'
    }`}
  >
    #{tag}
  </button>
);

// =====================================================
// HUVUDKOMPONENT
// =====================================================
const DevTimeline = ({ lang, isDark }) => {
  const [activeFilters, setActiveFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const allTags = useMemo(() => getAllTags(TIMELINE_EVENTS), []);

  const filteredEvents = useMemo(() => {
    if (activeFilters.length === 0) return TIMELINE_EVENTS;
    return TIMELINE_EVENTS.filter(event => 
      activeFilters.some(filter => event.tags.includes(filter))
    );
  }, [activeFilters]);

  const displayedEvents = showAll ? filteredEvents : filteredEvents.slice(0, 5);

  const toggleFilter = (tag) => {
    setActiveFilters(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => setActiveFilters([]);

  const t = {
    title: { sv: 'Min resa', en: 'My Journey' },
    subtitle: { sv: 'Utbildning, projekt & milstolpar', en: 'Education, projects & milestones' },
    filter: { sv: 'Filtrera', en: 'Filter' },
    clearFilters: { sv: 'Rensa filter', en: 'Clear filters' },
    showMore: { sv: 'Visa fler', en: 'Show more' },
    showLess: { sv: 'Visa färre', en: 'Show less' },
    noResults: { sv: 'Inga händelser matchar filtret', en: 'No events match the filter' }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className={`text-xl md:text-2xl font-bold mb-1 ${isDark ? 'text-neon-purple' : 'text-warm-accent'}`}>
          {t.title[lang]}
        </h2>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-warm-muted'}`}>
          {t.subtitle[lang]}
        </p>
      </div>

      {/* Filter-toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors
            ${isDark 
              ? 'bg-white/5 text-gray-300 hover:bg-white/10' 
              : 'bg-warm-hover text-warm-text hover:bg-warm-active'}`}
        >
          <Filter size={16} />
          {t.filter[lang]}
          {activeFilters.length > 0 && (
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${isDark ? 'bg-neon-purple text-white' : 'bg-warm-accent text-white'}`}>
              {activeFilters.length}
            </span>
          )}
          {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Filter-chips */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 mt-3 pb-2">
                {allTags.map(tag => (
                  <FilterChip
                    key={tag}
                    tag={tag}
                    isActive={activeFilters.includes(tag)}
                    onClick={() => toggleFilter(tag)}
                    isDark={isDark}
                  />
                ))}
                {activeFilters.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-colors
                      ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}`}
                  >
                    <X size={12} />
                    {t.clearFilters[lang]}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tidslinje */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
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
                />
              ))}
            </AnimatePresence>

            {/* Visa mer/mindre */}
            {filteredEvents.length > 5 && (
              <div className="pt-4 pl-8 md:pl-12">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all
                    ${isDark 
                      ? 'bg-neon-purple/10 text-neon-purple border border-neon-purple/30 hover:bg-neon-purple/20' 
                      : 'bg-warm-accentLight text-warm-accent border border-purple-200 hover:bg-purple-100'}`}
                >
                  {showAll ? (
                    <>
                      <ChevronUp size={16} />
                      {t.showLess[lang]}
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} />
                      {t.showMore[lang]} ({filteredEvents.length - 5})
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={`text-center py-12 ${isDark ? 'text-gray-500' : 'text-warm-subtle'}`}>
            <Filter size={32} className="mx-auto mb-3 opacity-50" />
            <p>{t.noResults[lang]}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevTimeline;