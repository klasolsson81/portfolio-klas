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
        { bg: '#E5E7EB', border: '#D1D5DB' }, // 0 - gray-200/300
        { bg: '#C084FC', border: '#A855F7' }, // 1 - purple-400/500
        { bg: '#9333EA', border: '#7C3AED' }, // 2 - purple-600/700
        { bg: '#7C3AED', border: '#6D28D9' }, // 3 - purple-700/800
        { bg: '#581C87', border: '#4C1D95' }, // 4 - purple-900/950
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

  const getMonthLabels = () => {
    if (contributions.length === 0) return [];

    const months = lang === 'sv'
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const labels = [];
    let lastMonth = -1;

    contributions.forEach((day, index) => {
      const month = day.date.getMonth();
      if (month !== lastMonth && index % 7 === 0) {
        labels.push({ month: months[month], index });
        lastMonth = month;
      }
    });

    return labels;
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

  const monthLabels = getMonthLabels();

  return (
    <div className={`mt-8 p-6 rounded-xl transition-all duration-300 border
      ${isDark
        ? 'bg-black/20 border-white/10 hover:border-neon-cyan/30'
        : 'bg-white/30 backdrop-blur-sm border-purple-200/50 hover:border-purple-400/50'}`}>

      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xs uppercase tracking-wider flex items-center gap-2
          ${isDark ? 'text-gray-500' : 'text-purple-600'}`}>
          <span className={isDark ? 'text-neon-purple' : 'text-purple-500'}>⚡</span>
          {lang === 'sv' ? 'Kodaktivitet (GitHub)' : 'Coding Activity (GitHub)'}
        </h3>
        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-purple-600'}`}>
          {totalContributions} {lang === 'sv' ? 'bidrag senaste 6 mån' : 'contributions last 6 months'}
        </span>
      </div>

      {/* Month labels */}
      <div className="relative mb-2">
        <div className="flex gap-[2px] md:gap-1">
          {monthLabels.map((label, idx) => (
            <div
              key={idx}
              style={{ marginLeft: `${(label.index / contributions.length) * 100}%` }}
              className={`text-[8px] md:text-[10px] absolute ${isDark ? 'text-gray-600' : 'text-purple-500'}`}
            >
              {label.month}
            </div>
          ))}
        </div>
      </div>

      {/* Contribution grid */}
      <div className="mt-6 overflow-hidden">
        <div className="grid grid-flow-col auto-cols-max gap-1 md:gap-1.5 justify-start">
          {contributions.map((day, index) => {
            const colorStyle = getColorStyle(day.level);
            return (
              <div
                key={index}
                className="group relative w-3 h-3 md:w-4 md:h-4 rounded-sm border-2 transition-all hover:scale-125"
                style={{
                  backgroundColor: colorStyle.bg,
                  borderColor: colorStyle.border
                }}
                title={`${formatDate(day.date)}: ${day.count} ${lang === 'sv' ? 'bidrag' : 'contributions'}`}
              >
                {/* Tooltip on hover */}
                <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-[10px] whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10
                  ${isDark ? 'bg-gray-900 text-gray-200 border border-white/10' : 'bg-white text-purple-900 border border-purple-200 shadow-lg'}`}>
                  {formatDate(day.date)}: {day.count} {lang === 'sv' ? 'bidrag' : 'contributions'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className={`flex items-center justify-between mt-4 text-[10px] ${isDark ? 'text-gray-600' : 'text-purple-600'}`}>
        <span>{lang === 'sv' ? 'Mindre' : 'Less'}</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map(level => {
            const colorStyle = getColorStyle(level);
            return (
              <div
                key={level}
                className="w-3 h-3 rounded-sm border-2"
                style={{
                  backgroundColor: colorStyle.bg,
                  borderColor: colorStyle.border
                }}
              />
            );
          })}
        </div>
        <span>{lang === 'sv' ? 'Mer' : 'More'}</span>
      </div>

      {/* GitHub link */}
      <div className="text-center mt-4">
        <a
          href="https://github.com/klasolsson81"
          target="_blank"
          rel="noreferrer"
          className={`text-[10px] transition-colors
            ${isDark
              ? 'text-gray-500 hover:text-neon-purple'
              : 'text-purple-500 hover:text-purple-700'}`}
        >
          {lang === 'sv' ? 'Visa hela profilen på GitHub →' : 'View full profile on GitHub →'}
        </a>
      </div>
    </div>
  );
};

export default GithubStats;