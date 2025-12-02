import React, { useState } from 'react';

// Tar emot isDark för tema-anpassning
const GithubStats = ({ isDark }) => {
  const [imageError, setImageError] = useState(false);

  // Olika färger för grafen beroende på tema
  // Mörkt: Lila (#bd00ff), Ljust: Violet (#8B5CF6)
  const chartColor = isDark ? 'bd00ff' : '8B5CF6';

  return (
    <div className={`mt-8 p-6 rounded-xl transition-all duration-300 border
      ${isDark 
        ? 'bg-black/20 border-white/10 hover:border-neon-cyan/30' 
        : 'bg-white/60 backdrop-blur-sm border-warm-border hover:border-warm-accent/40 shadow-sm'}`}>
        
      <h3 className={`text-xs mb-4 uppercase tracking-wider flex items-center gap-2
        ${isDark ? 'text-gray-500' : 'text-warm-muted'}`}>
        <span className={isDark ? 'text-neon-purple' : 'text-warm-accent'}>⚡</span> 
        Coding Activity (GitHub)
      </h3>
      
      {!imageError ? (
        <div className={`flex justify-center overflow-x-auto custom-scrollbar pb-2 rounded-lg p-3
          ${isDark ? '' : 'bg-warm-bg/50'}`}>
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
        <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-warm-subtle'}`}>
          <p>Kunde inte ladda GitHub-statistik</p>
          <a 
            href="https://github.com/klasolsson81" 
            target="_blank" 
            rel="noreferrer" 
            className={`transition-colors ${isDark ? 'text-neon-purple hover:text-neon-cyan' : 'text-warm-accent hover:text-warm-accentDark'} hover:underline`}
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
                : 'text-warm-subtle hover:text-warm-accent'}`}
          >
            Visa hela profilen på GitHub →
          </a>
        </div>
      )}
    </div>
  );
};

export default GithubStats;