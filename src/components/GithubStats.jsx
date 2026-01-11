import React, { useState, useEffect } from 'react';

/**
 * Custom GitHub Contributions Calendar
 * Mobiloptimerad med horisontell scroll och sticky labels.
 */
const GithubStats = ({ isDark, lang = 'sv' }) => {
  const [contributions, setContributions] = useState([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchGitHubContributions();
  }, []);

  const fetchGitHubContributions = async () => {
    try {
      const response = await fetch('/api/github-contributions');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      const calendar = data.contributions.map(day => ({
        date: new Date(day.date),
        count: day.count,
        level: getContributionLevel(day.count),
        color: day.color,
      }));
      setContributions(calendar);
      setTotalContributions(data.totalContributions);
      setLoading(false);
    } catch (err) {
      console.error('GitHub API error:', err);
      setError(true);
      setLoading(false);
    }
  };

  const getContributionLevel = (count) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
  };

  const getColorStyle = (level) => {
    if (isDark) {
      const colors = [
        { bg: 'rgba(55, 65, 81, 0.4)', border: 'rgba(75, 85, 99, 0.6)', shadow: 'none' },
        { bg: '#9333EA', border: '#A855F7', shadow: '0 0 8px #9333EA80' },
        { bg: '#C084FC', border: '#D8B4FE', shadow: '0 0 10px #C084FC90' },
        { bg: '#06B6D4', border: '#22D3EE', shadow: '0 0 12px #06B6D4A0' },
        { bg: '#67E8F9', border: '#A5F3FC', shadow: '0 0 14px #67E8F9B0' },
      ];
      return colors[level];
    } else {
      const colors = [
        { bg: 'rgba(232, 223, 211, 0.6)', border: 'rgba(209, 196, 184, 0.8)', shadow: 'none' },
        { bg: '#F59E0B', border: '#F97316', shadow: '0 0 4px #F59E0B80' },
        { bg: '#EA580C', border: '#DC2626', shadow: '0 0 5px #EA580C90' },
        { bg: '#D2691E', border: '#CC5500', shadow: '0 0 6px #D2691EA0' },
        { bg: '#FF9800', border: '#F57C00', shadow: '0 0 7px #FF9800B0' },
      ];
      return colors[level];
    }
  };

  const formatDate = (date) => {
    const months = lang === 'sv'
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const organizeByMonths = () => {
    if (contributions.length === 0) return [];
    const monthBlocks = [];
    contributions.forEach((day) => {
      const monthLabel = formatDate(day.date).split(' ')[1];
      const year = day.date.getFullYear();
      const key = `${year}-${day.date.getMonth()}`;
      let currentMonth = monthBlocks.find(m => m.key === key);
      if (!currentMonth) {
        currentMonth = { key, name: monthLabel, days: [] };
        monthBlocks.push(currentMonth);
      }
      currentMonth.days.push(day);
    });
    return monthBlocks.map(month => {
      const weeks = [];
      let currentWeek = [];
      const firstDayOfWeek = month.days[0].date.getDay();
      for (let i = 0; i < firstDayOfWeek; i++) currentWeek.push(null);
      month.days.forEach(day => {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
      });
      if (currentWeek.length > 0) {
        while (currentWeek.length < 7) currentWeek.push(null);
        weeks.push(currentWeek);
      }
      return { ...month, weeks };
    });
  };

  if (loading || error) {
    return (
      <div className={`mt-8 p-6 rounded-2xl border text-center ${isDark ? 'bg-black/30 border-white/10 text-gray-400' : 'bg-orange-50/40 border-orange-200/60 text-warm-accent'}`}>
        <p className="animate-pulse font-mono text-xs">{loading ? (lang === 'sv' ? 'HÄMTAR DATA...' : 'LOADING DATA...') : (lang === 'sv' ? 'SYSTEMFEL' : 'SYSTEM ERROR')}</p>
      </div>
    );
  }

  const months = organizeByMonths();
  const dayLabels = lang === 'sv' ? ['S', 'M', 'T', 'O', 'T', 'F', 'L'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className={`mt-8 p-4 md:p-7 rounded-2xl transition-all duration-500 border w-full md:max-w-fit mx-auto relative overflow-hidden group/card
      ${isDark
        ? 'bg-black/30 border-white/10 backdrop-blur-lg shadow-[0_0_30px_-10px_rgba(147,51,234,0.3)] hover:border-neon-cyan/50'
        : 'bg-gradient-to-br from-orange-50/90 via-amber-50/80 to-yellow-50/70 backdrop-blur-lg border-orange-200/50 shadow-xl hover:border-orange-300/80'}`}>

      {isDark && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent -translate-y-full group-hover/card:translate-y-full transition-transform duration-[2000ms] z-0"></div>
      )}

      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className={`text-[10px] md:text-xs uppercase tracking-[0.15em] flex items-center gap-2 font-bold
          ${isDark ? 'animate-section-gradient' : 'light-section-gradient'}`}>
          <span className={`text-sm md:text-lg ${isDark ? 'text-neon-cyan' : 'text-warm-accent'}`}>⚡</span>
          {lang === 'sv' ? 'KODAKTIVITET' : 'CODING ACTIVITY'}
        </h3>
        <div className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full backdrop-blur-sm border
          ${isDark ? 'bg-cyan-950/30 text-cyan-400 border-cyan-800/50' : 'bg-orange-100/50 text-warm-accent border-orange-200/60'}`}>
          <span className="font-mono">{totalContributions}</span> {lang === 'sv' ? 'bidrag 6 mån' : 'contribs 6 mo'}
        </div>
      </div>

      {/* Kalender med horisontell scroll för mobil */}
      <div className="flex justify-start relative z-10 overflow-x-auto pb-4 custom-scrollbar-horizontal select-none">
        <div className="inline-flex gap-3 md:gap-5 items-end min-w-max px-1">
          
          {/* Veckodags-etiketter (Sticky till vänster vid scroll) */}
          <div className={`sticky left-0 z-20 flex flex-col gap-[3px] md:gap-[4px] pb-[3px] h-[78px] md:h-[98px] justify-between font-mono pr-2
            ${isDark ? 'text-cyan-400/70' : 'text-warm-accent/70'}`}>
            {dayLabels.map((day, idx) => (
              <div key={idx} className={`w-3 md:w-4 text-[8px] md:text-[9px] font-bold text-right leading-none ${(idx === 1 || idx === 3 || idx === 5) ? 'opacity-100' : 'opacity-30'}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Månadsblock */}
          <div className="flex gap-3 md:gap-4">
            {months.map((month) => (
              <div key={month.key} className="flex flex-col gap-2 md:gap-3">
                <div className={`text-[8px] md:text-[10px] font-black text-center uppercase tracking-wide bg-clip-text text-transparent
                  ${isDark ? 'bg-gradient-to-r from-purple-400 to-cyan-400' : 'bg-gradient-to-r from-orange-600 to-amber-600'}`}>
                  {month.name}
                </div>
                
                <div className="flex gap-[3px] md:gap-[4px]">
                  {month.weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-[3px] md:gap-[4px]">
                      {week.map((day, dIdx) => {
                        if (!day) return <div key={dIdx} className="w-2 h-2 md:w-[10px] md:h-[10px]" />;
                        const colorStyle = getColorStyle(day.level);
                        return (
                          <div
                            key={dIdx}
                            className={`group relative w-2 h-2 md:w-[10px] md:h-[10px] rounded-[1.5px] md:rounded-[2px] border transition-all duration-300 cursor-pointer
                              hover:scale-150 hover:z-20
                              ${isDark ? 'hover:border-cyan-300' : 'hover:border-orange-400'}`}
                            style={{
                              backgroundColor: colorStyle.bg,
                              borderColor: colorStyle.border,
                              boxShadow: colorStyle.shadow
                            }}
                          >
                            {/* Tooltip */}
                            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 rounded-md text-[10px] font-bold whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 scale-90 group-hover:scale-100
                              ${isDark 
                                ? 'bg-gray-900/95 text-cyan-300 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.4)] backdrop-blur-xl' 
                                : 'bg-white/95 text-warm-text border border-orange-300/50 shadow-xl backdrop-blur-xl'}`}>
                              <div className="font-mono text-[9px] opacity-70 mb-0.5">{formatDate(day.date)}</div>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-lg leading-none ${isDark ? 'text-purple-400' : 'text-orange-500'}`}>◆</span>
                                <span className="text-base">{day.count}</span>
                                <span className="font-medium tracking-tight">{lang === 'sv' ? 'bidrag' : 'contributions'}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-4 md:mt-7 relative z-10">
        <span className={`text-[8px] md:text-[9px] font-bold tracking-wider uppercase ${isDark ? 'text-gray-500' : 'text-warm-accent/60'}`}>Less</span>
        <div className="flex gap-1 md:gap-1.5 p-1 rounded-full backdrop-blur-sm border ${isDark ? 'bg-black/20 border-white/5' : 'bg-orange-50/30 border-orange-200/30'}">
          {[0, 1, 2, 3, 4].map(level => {
            const colorStyle = getColorStyle(level);
            return (
              <div key={level} className="w-2 h-2 md:w-[10px] md:h-[10px] rounded-[1.5px] md:rounded-[2px] border transition-all duration-300 hover:scale-125"
                style={{ backgroundColor: colorStyle.bg, borderColor: colorStyle.border, boxShadow: colorStyle.shadow }}
                title={level === 0 ? '0' : level === 1 ? '1-2' : level === 2 ? '3-5' : level === 3 ? '6-10' : '10+'}
              />
            );
          })}
        </div>
        <span className={`text-[8px] md:text-[9px] font-bold tracking-wider uppercase ${isDark ? 'text-gray-500' : 'text-warm-accent/60'}`}>More</span>
      </div>
    </div>
  );
};

export default GithubStats;