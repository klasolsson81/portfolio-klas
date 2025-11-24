import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Loader2, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // <--- NY IMPORT

import aiKlasImage from '../assets/aiklas.png';

const ChatUI = ({ lang }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const welcomeText = lang === 'sv' 
      ? "Hej! Det är jag som är Klas (i AI-form). Fråga mig gärna om min kod, mina projekt eller varför jag sadlade om till systemutvecklare!"
      : "Hi! I'm Klas (AI version). Feel free to ask me about my code, my projects, or why I switched careers to system development!";
    
    setMessages([{ role: 'assistant', content: welcomeText }]);
  }, [lang]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/chat', { message: input, lang: lang });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: lang === 'sv' ? "Kunde inte nå servern." : "Could not reach server." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full bg-black/40 rounded-2xl overflow-hidden border border-white/5 shadow-inner relative">
       <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
          <Sparkles size={40} className="text-neon-purple animate-pulse"/>
       </div>

      {/* Meddelandelista */}
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
              {/* HÄR ÄR MAGIN: ReactMarkdown renderar texten snyggt */}
              <ReactMarkdown
                components={{
                  // Gör länkar Cyan, understrukna och öppnas i ny flik
                  a: ({node, ...props}) => <a {...props} className="text-neon-cyan underline hover:text-white break-all" target="_blank" rel="noopener noreferrer" />,
                  // Fixa listor och paragrafer
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

      {/* Input */}
      <form onSubmit={sendMessage} className="p-3 md:p-4 bg-black/80 border-t border-white/10 flex gap-2 items-center">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={lang === 'sv' ? "Skriv din fråga här..." : "Type your question here..."}
          className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 outline-none text-white text-sm placeholder-gray-500 focus:border-neon-purple/50 transition-colors"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="p-2.5 rounded-full bg-neon-cyan text-black hover:bg-neon-purple hover:text-white transition-all disabled:opacity-50 shadow-lg shadow-neon-cyan/20 shrink-0"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatUI;