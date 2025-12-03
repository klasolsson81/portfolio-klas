import React, { useState } from 'react';

// Tar emot isDark för tema-anpassning
const GithubStats = ({ isDark }) => {
  const [imageError, setImageError] = useState(false);

  // Olika färger för grafen beroende på tema
  const chartColor = isDark ? 'bd00ff' : '8B5CF6';

  return (
    <div className={`mt-8 p-6 rounded-xl transition-all duration-300 border
      ${isDark 
        ? 'bg-black/20 border-white/10 hover:border-neon-cyan/30' 
        : 'bg-white/30 backdrop-blur-sm border-purple-200/50 hover:border-purple-400/50'}`}>
        
      <h3 className={`text-xs mb-4 uppercase tracking-wider flex items-center gap-2
        ${isDark ? 'text-gray-500' : 'text-purple-600'}`}>
        <span className={isDark ? 'text-neon-purple' : 'text-purple-500'}>⚡</span> 
        Coding Activity (GitHub)
      </h3>
      
      {!imageError ? (
        <div className={`flex justify-center overflow-x-auto custom-scrollbar pb-2 rounded-lg p-3
          ${isDark ? '' : 'bg-white/20'}`}>
          <img 
            src={`https://ghchart.rshah.org/${chartColor}/klasolsson81`}
            alt="Klas GitHub Activity Graph"
            className={`min-w-[600px] md:min-w-full transition-all
              ${isDark 
                ? 'opacity-90 hover:opacity-100 invert hue-rotate-180 brightness-110' 
                : 'opacity-90 hover:opacity-100'}`}
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-purple-600'}`}>
          <p>Kunde inte ladda GitHub-statistik</p>
          <a 
            href="https://github.com/klasolsson81" 
            target="_blank" 
            rel="noreferrer" 
            className={`transition-colors ${isDark ? 'text-neon-purple hover:text-neon-cyan' : 'text-purple-700 hover:text-purple-900'} hover:underline`}
          >
            Besök min GitHub-profil →
          </a>
        </div>
      )}
      
      {!imageError && (
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
            Visa hela profilen på GitHub →
          </a>
        </div>
      )}
    </div>
  );
};

export default GithubStats;