import React, { useState, useRef, useEffect } from 'react';
import apiClient from '../../lib/api/client';
import { Send, Loader2, Sparkles, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import aiKlasImage from '../assets/aiklas.png';
import { sanitizeTextInput } from '../../lib/validators/inputValidator';
import { CHAT_CONFIG, UI } from '../../lib/config/constants';

const ChatUI = ({ lang, isDark }) => {
  // Initialize messages from localStorage or empty array
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(CHAT_CONFIG.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate that it's an array with valid message objects
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load chat history:', e);
    }
    return [];
  });

  // Initialize threadId from localStorage (for OpenAI Assistants API thread persistence)
  const [threadId, setThreadId] = useState(() => {
    try {
      return localStorage.getItem(`${CHAT_CONFIG.STORAGE_KEY}_threadId`) || null;
    } catch (e) {
      console.error('Failed to load thread ID:', e);
      return null;
    }
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  // Show welcome message if no history exists or language changes
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeText = lang === 'sv'
        ? "Hej! Det är jag som är Klas (i AI-form). Fråga mig gärna om min kod, mina projekt eller varför jag sadlade om till systemutvecklare!"
        : "Hi! I'm Klas (AI version). Feel free to ask me about my code, my projects, or why I switched careers to system development!";

      setMessages([{ role: 'assistant', content: welcomeText }]);
    }
  }, [lang, messages.length]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(CHAT_CONFIG.STORAGE_KEY, JSON.stringify(messages));
      } catch (e) {
        console.error('Failed to save chat history:', e);
      }
    }
  }, [messages]);

  // Save threadId to localStorage whenever it changes
  useEffect(() => {
    if (threadId) {
      try {
        localStorage.setItem(`${CHAT_CONFIG.STORAGE_KEY}_threadId`, threadId);
      } catch (e) {
        console.error('Failed to save thread ID:', e);
      }
    }
  }, [threadId]);

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    const cleanInput = input.trim();
    if (!cleanInput || loading) return;

    // Sanitize input to prevent XSS and injection attacks
    const sanitized = sanitizeTextInput(cleanInput, CHAT_CONFIG.MAX_MESSAGE_LENGTH);
    if (!sanitized) return;  // Don't send if sanitization removed everything

    const userMsg = { role: 'user', content: sanitized };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setLoading(true);

    try {
      const res = await apiClient.post('/api/chat', {
        message: sanitized,
        lang: lang,
        threadId: threadId  // Send existing threadId to continue conversation
      });

      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);

      // Save threadId from response for future requests
      if (res.data.threadId && res.data.threadId !== threadId) {
        setThreadId(res.data.threadId);
      }
    } catch (err) {
      // Error already handled by apiClient interceptor (toast shown)
      // Just add a fallback message to chat if response failed
      const errorMsg = lang === 'sv'
        ? "Något gick fel. Försök igen."
        : "Something went wrong. Please try again.";

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

  // Clear conversation history
  const clearHistory = () => {
    setMessages([]);
    setThreadId(null);
    localStorage.removeItem(CHAT_CONFIG.STORAGE_KEY);
    localStorage.removeItem(`${CHAT_CONFIG.STORAGE_KEY}_threadId`);
    // Welcome message will be shown by the useEffect above
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`flex flex-col flex-1 min-h-0 w-full rounded-2xl overflow-hidden border shadow-inner relative transition-colors duration-300
      ${isDark
        ? 'bg-black/40 border-white/5'
        : 'bg-white/30 backdrop-blur-sm border-purple-200/50'}`}>

      {/* Decorative sparkles */}
      <div className={`absolute top-4 right-14 opacity-20 pointer-events-none
        ${isDark ? 'text-neon-purple' : 'text-purple-500'}`}>
        <Sparkles size={32} className="animate-pulse"/>
      </div>

      {/* Clear history button */}
      {messages.length > 1 && (
        <button
          onClick={clearHistory}
          className={`absolute top-4 right-4 z-10 p-2 rounded-lg transition-all hover:scale-110 group
            ${isDark
              ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300'
              : 'bg-red-500/10 hover:bg-red-500/20 text-red-600 hover:text-red-700'}`}
          title={lang === 'sv' ? 'Rensa historik' : 'Clear history'}
          aria-label={lang === 'sv' ? 'Rensa chatthistorik' : 'Clear chat history'}
        >
          <Trash2 size={18} />
        </button>
      )}

      {/* Meddelandeområdet */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start items-end'}`}>
            
            {m.role === 'assistant' && (
              <img
                src={aiKlasImage}
                alt="AI Klas"
                loading="lazy"
                decoding="async"
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
              loading="lazy"
              decoding="async"
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
            maxLength={CHAT_CONFIG.MAX_MESSAGE_LENGTH}
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

        {input.length > UI.CHAR_COUNTER_THRESHOLD && (
          <div className={`absolute bottom-1 left-6 text-[10px] ${isDark ? 'text-gray-500' : 'text-purple-500'}`}>
            {input.length} / {CHAT_CONFIG.MAX_MESSAGE_LENGTH}
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatUI;