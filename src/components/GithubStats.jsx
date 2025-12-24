import React, { useState, useEffect } from 'react';

/**
 * Custom GitHub Contributions Calendar
 * Shows last 6 months of activity in a responsive grid
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
      // Fetch from our API endpoint (uses GitHub GraphQL API server-side)
      const response = await fetch('/api/github-contributions');

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();

      // Convert API response to calendar format
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
        { bg: '#374151', border: '#4B5563' }, // 0 - gray-700/600
        { bg: '#9333EA', border: '#A855F7' }, // 1 - purple-600/500
        { bg: '#C084FC', border: '#D8B4FE' }, // 2 - purple-400/300
        { bg: '#06B6D4', border: '#22D3EE' }, // 3 - cyan-500/400
        { bg: '#67E8F9', border: '#A5F3FC' }, // 4 - cyan-300/200
      ];
      return colors[level];
    } else {
      const colors = [
        { bg: '#E8DFD3', border: '#D1C4B8' }, // 0 - warm beige/tan
        { bg: '#F59E0B', border: '#F97316' }, // 1 - orange-500/orange-600
        { bg: '#EA580C', border: '#DC2626' }, // 2 - orange-600/red-600
        { bg: '#D2691E', border: '#CC5500' }, // 3 - terracotta/burnt orange (WARM!)
        { bg: '#FF9800', border: '#F57C00' }, // 4 - warm amber/orange-700 (WARM!)
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

  const organizeByWeeks = () => {
    if (contributions.length === 0) return [];

    // Group contributions into weeks (7 days each)
    const weeks = [];
    let currentWeek = [];

    // Start from the first day's day of week
    const firstDayOfWeek = contributions[0]?.date.getDay() || 0;

    // Add empty cells for days before the first day
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    contributions.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    // Add remaining days as the last week
    if (currentWeek.length > 0) {
      // Fill remaining days with null
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return weeks;
  };

  if (loading) {
    return (
      <div className={`mt-8 p-6 rounded-xl transition-all duration-300 border
        ${isDark
          ? 'bg-black/20 border-white/10'
          : 'bg-orange-50/30 backdrop-blur-sm border-orange-200/50'}`}>
        <h3 className={`text-xs mb-4 uppercase tracking-wider flex items-center gap-2
          ${isDark ? 'text-gray-500' : 'text-warm-accent'}`}>
          <span className={isDark ? 'text-neon-purple' : 'text-warm-accent'}>⚡</span>
          {lang === 'sv' ? 'Kodaktivitet (GitHub)' : 'Coding Activity (GitHub)'}
        </h3>
        <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-warm-accent'}`}>
          <p>{lang === 'sv' ? 'Laddar...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`mt-8 p-6 rounded-xl transition-all duration-300 border
        ${isDark
          ? 'bg-black/20 border-white/10'
          : 'bg-orange-50/30 backdrop-blur-sm border-orange-200/50'}`}>
        <h3 className={`text-xs mb-4 uppercase tracking-wider flex items-center gap-2
          ${isDark ? 'text-gray-500' : 'text-warm-accent'}`}>
          <span className={isDark ? 'text-neon-purple' : 'text-warm-accent'}>⚡</span>
          {lang === 'sv' ? 'Kodaktivitet (GitHub)' : 'Coding Activity (GitHub)'}
        </h3>
        <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-warm-accent'}`}>
          <p>{lang === 'sv' ? 'Kunde inte ladda GitHub-statistik' : 'Failed to load GitHub stats'}</p>
          <a
            href="https://github.com/klasolsson81"
            target="_blank"
            rel="noreferrer"
            className={`transition-colors ${isDark ? 'text-neon-purple hover:text-neon-cyan' : 'text-warm-accentDark hover:text-warm-text'} hover:underline`}
          >
            {lang === 'sv' ? 'Besök min GitHub-profil →' : 'Visit my GitHub profile →'}
          </a>
        </div>
      </div>
    );
  }

  const weeks = organizeByWeeks();
  const dayLabels = lang === 'sv'
    ? ['S', 'M', 'T', 'O', 'T', 'F', 'L'] // Sön, Mån, Tis, Ons, Tor, Fre, Lör
    : ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Sun, Mon, Tue, Wed, Thu, Fri, Sat

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

      {/* Contribution grid - GitHub style (weeks as columns, days as rows) */}
      <div className="mt-6 flex justify-center">
        <div className="inline-flex gap-[3px]">
          {/* Day labels column */}
          <div className="flex flex-col gap-[3px] justify-start pt-[16px]">
            {dayLabels.map((day, idx) => (
              <div
                key={idx}
                className={`w-4 h-2 flex items-center justify-start text-[9px] font-medium
                  ${isDark ? 'text-cyan-400/70' : 'text-warm-accent/70'}`}
              >
                {idx % 2 === 1 ? day : ''} {/* Show only odd indices (Mon, Wed, Fri) */}
              </div>
            ))}
          </div>

          {/* Weeks columns */}
          {weeks.map((week, weekIdx) => {
            // Check if next week starts a new month
            const currentMonth = week.find(d => d !== null)?.date.getMonth();
            const nextWeek = weeks[weekIdx + 1];
            const nextMonth = nextWeek?.find(d => d !== null)?.date.getMonth();
            const isMonthEnd = currentMonth !== nextMonth && nextMonth !== undefined;

            return (
              <div key={weekIdx} className={`flex flex-col gap-[3px] ${isMonthEnd ? 'mr-2' : ''}`}>
                {/* Month label for first day of week if new month */}
                <div className={`h-[16px] text-[9px] font-medium
                  ${isDark ? 'text-purple-400' : 'text-warm-accent'}`}>
                  {week.find(day => day !== null) && weekIdx > 0 &&
                   week.find(day => day !== null)?.date.getDate() <= 7
                    ? formatDate(week.find(day => day !== null).date).split(' ')[1]
                    : ''}
                </div>

                {/* Days of the week */}
                {week.map((day, dayIdx) => {
                  if (!day) {
                    // Empty cell for days before start or after end
                    return (
                      <div
                        key={dayIdx}
                        className="w-2 h-2"
                      />
                    );
                  }

                  const colorStyle = getColorStyle(day.level);
                  return (
                    <div
                      key={dayIdx}
                      className="group relative w-2 h-2 rounded-sm border transition-all duration-200 hover:scale-150 hover:z-10 cursor-pointer animate-in fade-in"
                      style={{
                        backgroundColor: colorStyle.bg,
                        borderColor: colorStyle.border,
                        boxShadow: day.level > 2 ? `0 0 4px ${colorStyle.bg}` : 'none'
                      }}
                      title={`${formatDate(day.date)}: ${day.count} ${lang === 'sv' ? 'bidrag' : 'contributions'}`}
                    >
                      {/* Tooltip on hover */}
                      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-[10px] whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10
                        ${isDark ? 'bg-gray-900 text-gray-200 border border-white/10 shadow-lg' : 'bg-white text-warm-text border border-orange-200 shadow-xl'}`}>
                        {formatDate(day.date)}: {day.count} {lang === 'sv' ? 'bidrag' : 'contributions'}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend - Compact */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {[0, 1, 2, 3, 4].map(level => {
          const colorStyle = getColorStyle(level);
          return (
            <div
              key={level}
              className="w-2.5 h-2.5 rounded-sm border transition-transform hover:scale-125"
              style={{
                backgroundColor: colorStyle.bg,
                borderColor: colorStyle.border,
                boxShadow: level > 2 ? `0 0 4px ${colorStyle.bg}50` : 'none'
              }}
              title={
                level === 0 ? (lang === 'sv' ? 'Ingen aktivitet' : 'No activity') :
                level === 1 ? '1-2' :
                level === 2 ? '3-5' :
                level === 3 ? '6-10' :
                '10+'
              }
            />
          );
        })}
      </div>

      {/* GitHub link */}
      <div className="text-center mt-4">
        <a
          href="https://github.com/klasolsson81"
          target="_blank"
          rel="noreferrer"
          className={`text-[10px] font-medium transition-all duration-200 hover:scale-105 inline-block
            ${isDark
              ? 'text-cyan-400 hover:text-neon-cyan'
              : 'text-warm-accent hover:text-warm-accentDark'}`}
        >
          {lang === 'sv' ? 'Visa hela profilen på GitHub →' : 'View full profile on GitHub →'}
        </a>
      </div>
    </div>
  );
};

export default GithubStats;