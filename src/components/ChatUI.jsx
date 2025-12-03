import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import aiKlasImage from '../assets/aiklas.png';

const ChatUI = ({ lang, isDark }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const MAX_LENGTH = 500;

  useEffect(() => {
    const welcomeText = lang === 'sv' 
      ? "Hej! Det är jag som är Klas (i AI-form). Fråga mig gärna om min kod, mina projekt eller varför jag sadlade om till systemutvecklare!"
      : "Hi! I'm Klas (AI version). Feel free to ask me about my code, my projects, or why I switched careers to system development!";
    
    setMessages([{ role: 'assistant', content: welcomeText }]);
  }, [lang]);

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    const cleanInput = input.trim();
    if (!cleanInput || loading) return;

    const userMsg = { role: 'user', content: cleanInput };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setLoading(true);

    try {
      const res = await axios.post('/api/chat', {
        message: cleanInput.substring(0, MAX_LENGTH),
        lang: lang
      }, { timeout: 15000 });

      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      let errorMsg = lang === 'sv' 
        ? "Något gick fel. Försök igen." 
        : "Something went wrong. Please try again.";

      if (err.code === 'ECONNABORTED') {
        errorMsg = lang === 'sv' 
          ? "Det tog för lång tid. Försök igen." 
          : "Timeout - please try again.";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`flex flex-col flex-1 min-h-0 w-full rounded-2xl overflow-hidden border shadow-inner relative transition-colors duration-300
      ${isDark 
        ? 'bg-black/40 border-white/5' 
        : 'bg-white/30 backdrop-blur-sm border-purple-200/50'}`}>
       
      <div className={`absolute top-4 right-4 opacity-20 pointer-events-none
        ${isDark ? 'text-neon-purple' : 'text-purple-500'}`}>
        <Sparkles size={40} className="animate-pulse"/>
      </div>

      {/* Meddelandeområdet */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start items-end'}`}>
            
            {m.role === 'assistant' && (
              <img 
                src={aiKlasImage} 
                alt="AI Klas"
                className={`w-10 h-10 md:w-14 md:h-14 rounded-full mr-2 md:mr-3 shadow-sm shrink-0 object-cover border
                  ${isDark ? 'border-neon-purple/30' : 'border-purple-300'}`}
              />
            )}

            {/* Chattbubblor med transparenta färger */}
            <div className={`max-w-[85%] p-3 md:p-4 rounded-2xl text-sm leading-relaxed shadow-sm overflow-hidden transition-colors duration-300 ${
              m.role === 'user' 
                ? (isDark 
                    ? 'bg-neon-purple/20 text-white border border-neon-purple/30 rounded-tr-sm' 
                    : 'bg-purple-500/20 text-purple-900 border border-purple-300/50 rounded-tr-sm')
                : (isDark 
                    ? 'bg-[#1a1b2e] text-gray-200 border border-white/5 rounded-tl-sm' 
                    : 'bg-white/40 text-purple-900 border border-purple-200/50 rounded-tl-sm backdrop-blur-sm')
            }`}>
              <ReactMarkdown
                components={{
                  a: ({node, ...props}) => (
                    <a 
                      {...props} 
                      className={`underline break-all ${isDark ? 'text-neon-cyan hover:text-white' : 'text-purple-700 hover:text-purple-900'}`}
                      target="_blank" 
                      rel="noopener noreferrer" 
                    />
                  ),
                  p: ({node, ...props}) => <p {...props} className="mb-2 last:mb-0" />,
                  ul: ({node, ...props}) => <ul {...props} className="list-disc pl-4 mb-2 space-y-1" />,
                  ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-4 mb-2 space-y-1" />,
                  li: ({node, ...props}) => <li {...props} />,
                  strong: ({node, ...props}) => (
                    <strong 
                      {...props} 
                      className={`font-bold ${isDark ? 'text-neon-purple' : 'text-purple-700'}`}
                    />
                  ),
                  code: ({node, ...props}) => (
                    <code 
                      {...props} 
                      className={`px-1 py-0.5 rounded text-xs font-mono ${isDark ? 'bg-black/40 text-neon-cyan' : 'bg-purple-100/50 text-purple-700'}`}
                    />
                  )
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start items-end">
            <img 
              src={aiKlasImage} 
              alt="AI Klas Thinking"
              className={`w-10 h-10 md:w-14 md:h-14 rounded-full mr-2 md:mr-3 shrink-0 object-cover border opacity-80
                ${isDark ? 'border-neon-purple/30' : 'border-purple-300'}`}
            />
            <div className={`p-3 md:p-4 rounded-2xl rounded-tl-sm border flex items-center gap-2 text-sm transition-colors duration-300
              ${isDark 
                ? 'bg-[#1a1b2e] border-white/5 text-gray-400' 
                : 'bg-white/40 border-purple-200/50 text-purple-600 backdrop-blur-sm'}`}>
              <Loader2 className={`animate-spin ${isDark ? 'text-neon-purple' : 'text-purple-600'}`} size={16} />
              {lang === 'sv' ? "Tänker..." : "Thinking..."}
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input-område */}
      <form onSubmit={sendMessage} className={`shrink-0 p-3 md:p-4 border-t relative transition-colors duration-300
        ${isDark 
          ? 'bg-black/80 border-white/10' 
          : 'bg-white/20 backdrop-blur-sm border-purple-200/50'}`}>
        <div className="flex gap-2 items-end">
          <textarea 
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={lang === 'sv' ? "Skriv din fråga här..." : "Type your question..."}
            className={`flex-1 rounded-xl px-4 py-3 outline-none text-sm transition-colors resize-none overflow-hidden min-h-[46px] max-h-[120px]
              ${isDark 
                ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-neon-purple/50' 
                : 'bg-white/50 border border-purple-200/50 text-purple-900 placeholder-purple-400 focus:border-purple-400'}`}
            maxLength={MAX_LENGTH} 
            aria-label="Chat input"
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className={`p-3 rounded-xl text-white transition-all disabled:opacity-50 shadow-md hover:shadow-lg shrink-0 mb-[1px]
              ${isDark 
                ? 'bg-neon-purple hover:bg-neon-purple/80' 
                : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            <Send size={18} />
          </button>
        </div>

        {input.length > 400 && (
          <div className={`absolute bottom-1 left-6 text-[10px] ${isDark ? 'text-gray-500' : 'text-purple-500'}`}>
            {input.length} / {MAX_LENGTH}
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatUI;