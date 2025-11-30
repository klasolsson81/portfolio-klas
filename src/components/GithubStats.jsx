import React, { useState } from 'react';

const GithubStats = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="mt-8 p-6 bg-black/20 border border-white/10 rounded-xl hover:border-neon-cyan/30 transition-colors">
      <h3 className="text-xs text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
        <span className="text-neon-cyan">⚡</span> Coding Activity (GitHub)
      </h3>
      
      {!imageError ? (
        <div className="flex justify-center overflow-x-auto custom-scrollbar pb-2">
          <img 
            src="https://ghchart.rshah.org/00f3ff/klasolsson81" 
            alt="Klas GitHub Activity Graph"
            className="min-w-[600px] md:min-w-full opacity-90 hover:opacity-100 transition-opacity invert hue-rotate-180 brightness-110"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <p>Kunde inte ladda GitHub-statistik</p>
          <a 
            href="https://github.com/klasolsson81" 
            target="_blank" 
            rel="noreferrer"
            className="text-neon-cyan hover:text-white transition-colors"
          >
            Besök min GitHub-profil →
          </a>
        </div>
      )}
      
      {/* Visa alltid länken under, även om grafen funkar */}
      {!imageError && (
        <div className="text-center mt-4">
            <a 
            href="https://github.com/klasolsson81" 
            target="_blank" 
            rel="noreferrer"
            className="text-[10px] text-gray-500 hover:text-white transition-colors"
            >
            Visa hela profilen på GitHub →
            </a>
        </div>
      )}
    </div>
  );
};

export default GithubStats;