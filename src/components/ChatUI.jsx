import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Loader2, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import aiKlasImage from '../assets/aiklas.png';

const ChatUI = ({ lang }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const textareaRef = useRef(null); // Ny ref för textfältet
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
    
    // Återställ input och höjd
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    setLoading(true);

    try {
      const res = await axios.post('/api/chat', { 
        message: cleanInput.substring(0, MAX_LENGTH), 
        lang: lang 
      }, {
        timeout: 15000 
      });

      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);

    } catch (err) {
      console.error('Chat error:', err);
      let errorMsg = lang === 'sv' ? "Något gick fel. Försök igen." : "Something went wrong. Please try again.";
      
      if (err.code === 'ECONNABORTED') {
        errorMsg = lang === 'sv' ? "Det tog för lång tid. Försök igen." : "Timeout - please try again.";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  // Hantera tangenter (Enter skickar, Shift+Enter gör ny rad)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Hindra ny rad
      sendMessage();
    }
  };

  // Auto-expand funktion
  const handleInput = (e) => {
    setInput(e.target.value);
    // Nollställ höjd för att räkna om
    e.target.style.height = 'auto';
    // Sätt ny höjd baserat på innehåll
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full bg-black/40 rounded-2xl overflow-hidden border border-white/5 shadow-inner relative">
       <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
          <Sparkles size={40} className="text-neon-purple animate-pulse"/>
       </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start items-end'}`}>
            
            {m.role === 'assistant' && (
              <img 
                src={aiKlasImage} 
                alt="AI Klas"
                className="w-14 h-14 rounded-full mr-3 shadow-lg shadow-neon-purple/20 shrink-0 object-cover border border-neon-purple/30"
              />
            )}

            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-md overflow-hidden ${
              m.role === 'user' 
                ? 'bg-neon-purple/20 text-white border border-neon-purple/30 rounded-tr-sm' 
                : 'bg-[#1a1b2e] text-gray-200 border border-white/5 rounded-tl-sm'
            }`}>
              <ReactMarkdown
                components={{
                  a: ({node, ...props}) => <a {...props} className="text-neon-cyan underline hover:text-white break-all" target="_blank" rel="noopener noreferrer" />,
                  p: ({node, ...props}) => <p {...props} className="mb-2 last:mb-0" />,
                  ul: ({node, ...props}) => <ul {...props} className="list-disc pl-4 mb-2 space-y-1" />,
                  ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-4 mb-2 space-y-1" />,
                  li: ({node, ...props}) => <li {...props} />,
                  strong: ({node, ...props}) => <strong {...props} className="text-neon-purple font-bold" />
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
                    className="w-14 h-14 rounded-full mr-3 shrink-0 object-cover border border-neon-purple/30 opacity-80"
                  />
                <div className="bg-[#1a1b2e] p-4 rounded-2xl rounded-tl-sm border border-white/5 flex items-center gap-2 text-gray-400 text-sm">
                    <Loader2 className="animate-spin text-neon-cyan" size={16} />
                    {lang === 'sv' ? "Tänker..." : "Thinking..."}
                </div>
            </div>
        )}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={sendMessage} className="p-3 md:p-4 bg-black/80 border-t border-white/10 relative">
        {/* Flex-container som justerar knappen längst ner (items-end) */}
        <div className="flex gap-2 items-end">
            <textarea 
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={lang === 'sv' ? "Skriv din fråga här..." : "Type your question..."}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white text-sm placeholder-gray-500 focus:border-neon-purple/50 transition-colors resize-none overflow-hidden min-h-[46px] max-h-[120px]"
              maxLength={MAX_LENGTH} 
              aria-label="Chat input"
            />
            
            <button 
              type="submit" 
              disabled={loading}
              className="p-3 rounded-xl bg-neon-cyan text-black hover:bg-neon-purple hover:text-white transition-all disabled:opacity-50 shadow-lg shadow-neon-cyan/20 shrink-0 mb-[1px]"
            >
              <Send size={18} />
            </button>
        </div>

        {/* Teckenräknare */}
        {input.length > 400 && (
            <div className="absolute bottom-1 left-6 text-[10px] text-gray-500">
                {input.length} / {MAX_LENGTH}
            </div>
        )}
      </form>
    </div>
  );
};

export default ChatUI;