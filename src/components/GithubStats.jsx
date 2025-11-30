import React, { useState } from 'react';

// NYTT: Tar emot isDark
const GithubStats = ({ isDark }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`mt-8 p-6 rounded-xl transition-colors border
      ${isDark 
        ? 'bg-black/20 border-white/10 hover:border-neon-cyan/30' 
        : 'bg-white border-gray-200 hover:border-neon-purple/50'}`}>
        
      <h3 className="text-xs text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
        <span className="text-neon-purple">⚡</span> Coding Activity (GitHub)
      </h3>
      
      {!imageError ? (
        <div className="flex justify-center overflow-x-auto custom-scrollbar pb-2">
          {/* ÄNDRING: Tar bort invert/hue-rotate i ljust läge */}
          <img 
            src="https://ghchart.rshah.org/bd00ff/klasolsson81" 
            alt="Klas GitHub Activity Graph"
            className={`min-w-[600px] md:min-w-full transition-all
              ${isDark 
                ? 'opacity-90 hover:opacity-100 invert hue-rotate-180 brightness-110' 
                : 'opacity-80 hover:opacity-100'}`}
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        // ... (Fallback-koden är samma som förut) ...
        <div className="text-center text-gray-500 py-8">
          <p>Kunde inte ladda GitHub-statistik</p>
          <a href="https://github.com/klasolsson81" target="_blank" rel="noreferrer" className="text-neon-purple hover:underline transition-colors">Besök min GitHub-profil →</a>
        </div>
      )}
      
      {!imageError && (
        <div className="text-center mt-4">
            <a href="https://github.com/klasolsson81" target="_blank" rel="noreferrer" className="text-[10px] text-gray-500 hover:text-neon-purple transition-colors">Visa hela profilen på GitHub →</a>
        </div>
      )}
    </div>
  );
};

export default GithubStats;