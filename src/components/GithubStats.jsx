import React, { useState, useEffect } from 'react';

/**
 * Custom GitHub Contributions Calendar
 * Grupperad per månad för tydligare visning
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
        { bg: '#374151', border: '#4B5563' }, // 0
        { bg: '#9333EA', border: '#A855F7' }, // 1
        { bg: '#C084FC', border: '#D8B4FE' }, // 2
        { bg: '#06B6D4', border: '#22D3EE' }, // 3
        { bg: '#67E8F9', border: '#A5F3FC' }, // 4
      ];
      return colors[level];
    } else {
      const colors = [
        { bg: '#E8DFD3', border: '#D1C4B8' }, // 0
        { bg: '#F59E0B', border: '#F97316' }, // 1
        { bg: '#EA580C', border: '#DC2626' }, // 2
        { bg: '#D2691E', border: '#CC5500' }, // 3
        { bg: '#FF9800', border: '#F57C00' }, // 4
      ];
      return colors[level];
    }
  };

  const formatDate = (date) => {
    const months = lang === 'sv'
      ? ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // NY LOGIK: Gruppera bidrag i månadsblock
  const organizeByMonths = () => {
    if (contributions.length === 0) return [];

    const monthBlocks = [];
    
    // 1. Gruppera rådata per månad
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

    // 2. Förvandla dagarna i varje månad till kolumner (veckor)
    return monthBlocks.map(month => {
      const weeks = [];
      let currentWeek = [];

      // Justera första kolumnen så att rätt veckodag hamnar på rätt rad
      const firstDayOfWeek = month.days[0].date.getDay();
      for (let i = 0; i < firstDayOfWeek; i++) {
        currentWeek.push(null);
      }

      month.days.forEach(day => {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
      });

      // Fyll ut sista kolumnen om månaden inte slutar på en lördag
      if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
          currentWeek.push(null);
        }
        weeks.push(currentWeek);
      }

      return { ...month, weeks };
    });
  };

  if (loading || error) {
    return (
      <div className={`mt-8 p-6 rounded-xl border text-center ${isDark ? 'bg-black/20 border-white/10 text-gray-500' : 'bg-orange-50/30 border-orange-200/50 text-warm-accent'}`}>
        <p>{loading ? (lang === 'sv' ? 'Laddar kodaktivitet...' : 'Loading activity...') : (lang === 'sv' ? 'Kunde inte ladda statistik' : 'Failed to load stats')}</p>
      </div>
    );
  }

  const months = organizeByMonths();
  const dayLabels = lang === 'sv' ? ['S', 'M', 'T', 'O', 'T', 'F', 'L'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className={`mt-8 p-6 rounded-xl transition-all duration-300 border max-w-fit mx-auto
      ${isDark
        ? 'bg-black/20 border-white/10 hover:border-neon-cyan/30'
        : 'bg-gradient-to-br from-orange-50/80 via-amber-50/70 to-yellow-50/60 backdrop-blur-sm border-orange-200/40 hover:border-orange-300/60'}`}>

      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xs uppercase tracking-wider flex items-center gap-2 font-semibold
          ${isDark ? 'animate-section-gradient' : 'light-section-gradient'}`}>
          <span className={isDark ? 'text-neon-cyan' : 'text-warm-accent'}>⚡</span>
          {lang === 'sv' ? 'Kodaktivitet (GitHub)' : 'Coding Activity (GitHub)'}
        </h3>
        <span className={`text-xs font-semibold ${isDark ? 'text-cyan-400' : 'text-warm-accent'}`}>
          {totalContributions} {lang === 'sv' ? 'bidrag senaste 6 mån' : 'contributions last 6 months'}
        </span>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="inline-flex gap-4 items-end">
          {/* Veckodags-etiketter */}
          <div className="flex flex-col gap-[3px] pb-[2px]">
            {dayLabels.map((day, idx) => (
              <div key={idx} className={`w-4 h-2 flex items-center text-[9px] font-medium ${isDark ? 'text-cyan-400/50' : 'text-warm-accent/50'}`}>
                {idx % 2 === 1 ? day : ''}
              </div>
            ))}
          </div>

          {/* Månadsblock */}
          <div className="flex gap-3">
            {months.map((month) => (
              <div key={month.key} className="flex flex-col gap-2">
                {/* Månadsnamn centrerat över sina kolumner */}
                <div className={`text-[9px] font-bold text-center uppercase tracking-tighter
                  ${isDark ? 'text-purple-400' : 'text-warm-accent'}`}>
                  {month.name}
                </div>
                
                {/* Kolumnerna för denna månad */}
                <div className="flex gap-[3px]">
                  {month.weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-[3px]">
                      {week.map((day, dIdx) => {
                        if (!day) return <div key={dIdx} className="w-2 h-2" />;
                        const colorStyle = getColorStyle(day.level);
                        return (
                          <div
                            key={dIdx}
                            className="group relative w-2 h-2 rounded-sm border transition-all duration-200 hover:scale-150 hover:z-10 cursor-pointer"
                            style={{
                              backgroundColor: colorStyle.bg,
                              borderColor: colorStyle.border,
                              boxShadow: day.level > 2 ? `0 0 4px ${colorStyle.bg}80` : 'none'
                            }}
                          >
                            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-[10px] whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10
                              ${isDark ? 'bg-gray-900 text-gray-200 border border-white/10 shadow-lg' : 'bg-white text-warm-text border border-orange-200 shadow-xl'}`}>
                              {formatDate(day.date)}: {day.count} {lang === 'sv' ? 'bidrag' : 'contributions'}
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
      <div className="flex items-center justify-center gap-1.5 mt-6">
        {[0, 1, 2, 3, 4].map(level => {
          const colorStyle = getColorStyle(level);
          return (
            <div key={level} className="w-2 h-2 rounded-sm border"
              style={{ backgroundColor: colorStyle.bg, borderColor: colorStyle.border }}
              title={level === 0 ? '0' : level === 1 ? '1-2' : level === 2 ? '3-5' : level === 3 ? '6-10' : '10+'}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GithubStats;