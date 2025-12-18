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

      // Debug: Log raw API response
      console.log('Raw API response:', {
        totalContributions: data.totalContributions,
        contributionsCount: data.contributions?.length,
        firstFewContributions: data.contributions?.slice(0, 5)
      });

      // Convert API response to calendar format
      const calendar = data.contributions.map(day => ({
        date: new Date(day.date),
        count: day.count,
        level: getContributionLevel(day.count),
        color: day.color,
      }));

      setContributions(calendar);
      setTotalContributions(data.totalContributions);

      // Debug: Log what we're rendering
      console.log('GitHub calendar rendering:', {
        total: data.totalContributions,
        days: calendar.length,
        withContributions: calendar.filter(d => d.count > 0).length,
        levels: {
          level0: calendar.filter(d => d.level === 0).length,
          level1: calendar.filter(d => d.level === 1).length,
          level2: calendar.filter(d => d.level === 2).length,
          level3: calendar.filter(d => d.level === 3).length,
          level4: calendar.filter(d => d.level === 4).length,
        }
      });

      // Debug: Log sample days with contributions to verify count values
      const daysWithContributions = calendar.filter(d => d.count > 0).slice(0, 10);
      console.log('Sample days with contributions:', daysWithContributions.map(d => ({
        date: d.date.toISOString().split('T')[0],
        count: d.count,
        countType: typeof d.count,
        level: d.level,
        color: d.color
      })));

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
        { bg: '#C084FC', border: '#A855F7' }, // 1 - purple-400/500
        { bg: '#8B5CF6', border: '#7C3AED' }, // 2 - purple-500/600
        { bg: '#14B8A6', border: '#0D9488' }, // 3 - teal-500/600
        { bg: '#0891B2', border: '#0E7490' }, // 4 - cyan-600/700
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
          : 'bg-white/30 backdrop-blur-sm border-purple-200/50'}`}>
        <h3 className={`text-xs mb-4 uppercase tracking-wider flex items-center gap-2
          ${isDark ? 'text-gray-500' : 'text-purple-600'}`}>
          <span className={isDark ? 'text-neon-purple' : 'text-purple-500'}>⚡</span>
          {lang === 'sv' ? 'Kodaktivitet (GitHub)' : 'Coding Activity (GitHub)'}
        </h3>
        <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-purple-600'}`}>
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
          : 'bg-white/30 backdrop-blur-sm border-purple-200/50'}`}>
        <h3 className={`text-xs mb-4 uppercase tracking-wider flex items-center gap-2
          ${isDark ? 'text-gray-500' : 'text-purple-600'}`}>
          <span className={isDark ? 'text-neon-purple' : 'text-purple-500'}>⚡</span>
          {lang === 'sv' ? 'Kodaktivitet (GitHub)' : 'Coding Activity (GitHub)'}
        </h3>
        <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-purple-600'}`}>
          <p>{lang === 'sv' ? 'Kunde inte ladda GitHub-statistik' : 'Failed to load GitHub stats'}</p>
          <a
            href="https://github.com/klasolsson81"
            target="_blank"
            rel="noreferrer"
            className={`transition-colors ${isDark ? 'text-neon-purple hover:text-neon-cyan' : 'text-purple-700 hover:text-purple-900'} hover:underline`}
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
    <div className={`mt-8 p-6 rounded-xl transition-all duration-300 border
      ${isDark
        ? 'bg-black/20 border-white/10 hover:border-neon-cyan/30'
        : 'bg-white/30 backdrop-blur-sm border-purple-200/50 hover:border-purple-400/50'}`}>

      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xs uppercase tracking-wider flex items-center gap-2 font-semibold
          ${isDark
            ? 'bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-purple bg-clip-text text-transparent'
            : 'bg-gradient-to-r from-purple-600 via-teal-600 to-purple-600 bg-clip-text text-transparent'
          }`}>
          <span className={isDark ? 'text-neon-cyan' : 'text-purple-600'}>⚡</span>
          {lang === 'sv' ? 'Kodaktivitet (GitHub)' : 'Coding Activity (GitHub)'}
        </h3>
        <span className={`text-xs font-semibold ${isDark ? 'text-cyan-400' : 'text-teal-600'}`}>
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
                  ${isDark ? 'text-cyan-400/70' : 'text-teal-600/70'}`}
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
                  ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
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
                        ${isDark ? 'bg-gray-900 text-gray-200 border border-white/10 shadow-lg' : 'bg-white text-purple-900 border border-purple-200 shadow-xl'}`}>
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
              : 'text-teal-600 hover:text-purple-600'}`}
        >
          {lang === 'sv' ? 'Visa hela profilen på GitHub →' : 'View full profile on GitHub →'}
        </a>
      </div>
    </div>
  );
};

export default GithubStats;