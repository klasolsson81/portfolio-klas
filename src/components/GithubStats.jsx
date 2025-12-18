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
      // GitHub username
      const username = 'klasolsson81';

      // Calculate date range (last 6 months)
      const today = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(today.getMonth() - 6);

      // Fetch contribution data from GitHub API
      const response = await fetch(`https://api.github.com/users/${username}/events/public?per_page=100`);

      if (!response.ok) throw new Error('Failed to fetch');

      const events = await response.json();

      // Generate calendar grid for last 6 months
      const calendar = generateCalendarGrid(sixMonthsAgo, today, events);
      setContributions(calendar);

      // Calculate total contributions
      const total = calendar.reduce((sum, day) => sum + day.count, 0);
      setTotalContributions(total);

      setLoading(false);
    } catch (err) {
      console.error('GitHub API error:', err);
      setError(true);
      setLoading(false);
    }
  };

  const generateCalendarGrid = (startDate, endDate, events) => {
    const calendar = [];
    const currentDate = new Date(startDate);

    // Count contributions by date
    const contributionsByDate = {};
    events.forEach(event => {
      const date = new Date(event.created_at).toDateString();
      contributionsByDate[date] = (contributionsByDate[date] || 0) + 1;
    });

    // Generate grid
    while (currentDate <= endDate) {
      const dateStr = currentDate.toDateString();
      const count = contributionsByDate[dateStr] || 0;

      calendar.push({
        date: new Date(currentDate),
        count: count,
        level: getContributionLevel(count)
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return calendar;
  };

  const getContributionLevel = (count) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
  };

  const getColorClass = (level) => {
    if (isDark) {
      const colors = [
        'bg-gray-800/30 border-gray-700/50', // 0 contributions
        'bg-neon-purple/20 border-neon-purple/30', // Low
        'bg-neon-purple/40 border-neon-purple/50', // Medium
        'bg-neon-purple/70 border-neon-purple/80', // High
        'bg-neon-cyan border-neon-cyan shadow-sm shadow-neon-cyan/30', // Very high
      ];
      return colors[level];
    } else {
      const colors = [
        'bg-purple-100/30 border-purple-200/40', // 0 contributions
        'bg-purple-300/50 border-purple-400/60', // Low
        'bg-purple-500/60 border-purple-600/70', // Medium
        'bg-purple-600/80 border-purple-700/90', // High
        'bg-purple-700 border-purple-800 shadow-sm shadow-purple-500/30', // Very high
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
        <div className="grid grid-flow-col auto-cols-max gap-[2px] md:gap-1 justify-start">
          {contributions.map((day, index) => (
            <div
              key={index}
              className={`group relative w-2 h-2 md:w-3 md:h-3 rounded-sm border transition-all hover:scale-125 ${getColorClass(day.level)}`}
              title={`${formatDate(day.date)}: ${day.count} ${lang === 'sv' ? 'bidrag' : 'contributions'}`}
            >
              {/* Tooltip on hover */}
              <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-[10px] whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10
                ${isDark ? 'bg-gray-900 text-gray-200 border border-white/10' : 'bg-white text-purple-900 border border-purple-200 shadow-lg'}`}>
                {formatDate(day.date)}: {day.count} {lang === 'sv' ? 'bidrag' : 'contributions'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className={`flex items-center justify-between mt-4 text-[10px] ${isDark ? 'text-gray-600' : 'text-purple-600'}`}>
        <span>{lang === 'sv' ? 'Mindre' : 'Less'}</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm border ${getColorClass(level)}`}
            />
          ))}
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