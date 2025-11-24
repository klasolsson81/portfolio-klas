import React, { useState } from 'react';
import { Loader2, CheckCircle, XCircle, Briefcase, Send, RefreshCw, User, Mail, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

// Språkdatabas
const TRANSLATIONS = {
  sv: {
    title: "Anlita mig",
    subtitle: "Fyll i formuläret så låter jag min AI göra en första bedömning av projektet.",
    disclaimer: "OBSERVERA: Jag tar mig an projekt vid sidan av mina heltidsstudier och familjeliv. Detta formulär ger en första AI-bedömning, men jag garanterar inte att jag kan ta uppdraget.",
    labels: {
      help: "VAD BEHÖVER DU HJÄLP MED?",
      payment: "ERSÄTTNING?",
      budget: "BUDGET (CA KR)",
      desc: "BESKRIVNING",
      name: "DITT NAMN",
      email: "DIN EMAIL",
      who: "VEM ÄR DU?",
      security: "SÄKERHETSKOLL: VAD ÄR 3 + 4?"
    },
    placeholders: {
      budget: "t.ex. 5000",
      desc: "Vad behöver du hjälp med? Beskriv kort...",
      name: "Förnamn Efternamn",
      email: "namn@exempel.se",
      answer: "Svar"
    },
    options: {
      types: ["Hemsida (Enkel)", "Hemsida (Avancerad)", "Systemutveckling / Backend", "AI Integration / Automation", "Annat"],
      payment: ["Betalt", "Pro Bono (Gratis/Erfarenhet)"],
      org: ["Privatperson", "Företag", "Rekryterare"]
    },
    buttons: {
      analyze: "Analysera med AI",
      analyzing: "AI-agenten analyserar...",
      send: "Skicka förfrågan nu",
      sending: "Skickar...",
      new: "Gör ny förfrågan",
      change: "Ändra uppgifter"
    },
    status: {
      approved: "Låter intressant!",
      rejected: "Kanske inte just nu...",
      time: "TIDSESTIMAT",
      hours: "h",
      successTitle: "Tack för ditt mail!",
      successMsg: "Jag har tagit emot din förfrågan. Eftersom jag studerar heltid och har familj, svarar jag och tar mig an projekt i mån av tid. Jag återkommer till dig på",
      soon: "så snart jag kan!"
    },
    errors: {
      captcha: "Fel svar på säkerhetsfrågan.",
      ai: "Kunde inte nå AI-tjänsten.",
      mail: "Kunde inte skicka mailet. Försök igen senare."
    }
  },
  en: {
    title: "Hire Me",
    subtitle: "Fill out the form and let my AI do an initial assessment of the project.",
    disclaimer: "NOTE: I take on projects alongside my full-time studies and family life. This form provides an initial AI assessment, but I do not guarantee that I can take the assignment.",
    labels: {
      help: "WHAT DO YOU NEED HELP WITH?",
      payment: "COMPENSATION?",
      budget: "BUDGET (APPROX SEK)",
      desc: "DESCRIPTION",
      name: "YOUR NAME",
      email: "YOUR EMAIL",
      who: "WHO ARE YOU?",
      security: "SECURITY CHECK: WHAT IS 3 + 4?"
    },
    placeholders: {
      budget: "e.g. 5000",
      desc: "What do you need help with? Describe briefly...",
      name: "Firstname Lastname",
      email: "name@example.com",
      answer: "Answer"
    },
    options: {
      types: ["Website (Simple)", "Website (Advanced)", "System Development / Backend", "AI Integration / Automation", "Other"],
      payment: ["Paid", "Pro Bono (Free/Experience)"],
      org: ["Individual", "Company", "Recruiter"]
    },
    buttons: {
      analyze: "Analyze with AI",
      analyzing: "AI agent is analyzing...",
      send: "Send Request Now",
      sending: "Sending...",
      new: "Make New Request",
      change: "Change Details"
    },
    status: {
      approved: "Sounds Interesting!",
      rejected: "Maybe not right now...",
      time: "ESTIMATED TIME",
      hours: "h",
      successTitle: "Thank you for your email!",
      successMsg: "I have received your request. Since I study full-time and have a family, I respond and take on projects as time allows. I will get back to you at",
      soon: "as soon as I can!"
    },
    errors: {
      captcha: "Wrong answer to security question.",
      ai: "Could not reach AI service.",
      mail: "Could not send email. Try again later."
    }
  }
};

const HireMe = ({ lang = 'sv' }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.sv;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orgType: 'Privatperson',
    projectType: 'Hemsida (Enkel)',
    paymentType: 'Betalt',
    amount: '',
    description: '',
    captcha: ''
  });
  
  const [status, setStatus] = useState('idle'); 
  const [analysis, setAnalysis] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [mathQuestion] = useState({ q: "3 + 4", a: "7" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.captcha.trim() !== mathQuestion.a) {
      toast.error(t.errors.captcha);
      return;
    }

    setStatus('analyzing');

    try {
      const res = await axios.post('/api/analyze', formData);
      setAnalysis(res.data);
      setStatus(res.data.approved ? 'approved' : 'rejected');
    } catch (err) {
      console.error(err);
      setStatus('idle');
      toast.error(t.errors.ai);
    }
  };

  // --- HÄR ÄR FUNKTIONEN SOM SKICKAR MAILET ---
  const sendRealEmail = async () => {
    setIsSending(true);

    const subject = `Ny förfrågan från ${formData.name}: ${formData.projectType}`;
    
    // Mailet som kommer till DIG
    const emailBody = `
NY FÖRFRÅGAN VIA PORTFOLION (${lang.toUpperCase()})

AVSÄNDARE:
Namn: ${formData.name}
Email: ${formData.email}
Typ: ${formData.orgType}

PROJEKT:
Typ: ${formData.projectType}
Ersättning: ${formData.paymentType} ${formData.amount ? `(${formData.amount} kr)` : ''}

BESKRIVNING:
${formData.description}

---
AI-BEDÖMNING:
Tid: ${analysis.estimatedHours} timmar
Feedback: "${analysis.feedback}"
    `;

    try {
      await axios.post('/api/email', {
        subject: subject,
        body: emailBody,
        replyTo: formData.email, // Så att du kan svara direkt till kunden
        senderName: formData.name
      });

      toast.success(lang === 'sv' ? 'Tack! Din förfrågan har skickats.' : 'Thank you! Your request has been sent.');
      setStatus('sent');
      setIsSending(false);
      
    } catch (err) {
      console.error(err);
      toast.error(t.errors.mail);
      setIsSending(false);
    }
  };

  const inputClass = "w-full bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white focus:border-neon-purple outline-none transition-colors placeholder-gray-600 appearance-none text-sm";
  const labelClass = "block text-[10px] text-gray-400 uppercase mb-1 font-bold tracking-wider";

  // SUCCESS-VY
  if (status === 'sent') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 animate-fade-in">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <CheckCircle size={48} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{t.status.successTitle}</h2>
        <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
          {t.status.successMsg} <strong>{formData.email}</strong> {t.status.soon}
        </p>
        
        {/* KNAPP: Gör ny förfrågan (Grön ram & hover) */}
        <button 
          onClick={() => {
            setStatus('idle'); 
            setFormData({ ...formData, name: '', email: '', description: '', captcha: '' });
          }} 
          className="px-8 py-3 bg-transparent border border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-500 hover:text-green-300 rounded-full font-medium transition-all"
        >
          {t.buttons.new}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col p-1 pb-10"> 
      <h2 className="text-2xl font-bold text-neon-purple mb-2">{t.title}</h2>
      
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg mb-6 text-xs text-amber-100/90 leading-relaxed flex gap-3 items-start shadow-sm">
         <Briefcase className="text-amber-400 shrink-0 mt-0.5" size={18} />
         <p>{t.disclaimer}</p>
      </div>

      {status === 'idle' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t.labels.name}</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-500" size={16} />
                <input type="text" required className={`${inputClass} pl-10`} placeholder={t.placeholders.name} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>
            <div>
              <label className={labelClass}>{t.labels.email}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-500" size={16} />
                <input type="email" required className={`${inputClass} pl-10`} placeholder={t.placeholders.email} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
          </div>

          <div>
             <label className={labelClass}>{t.labels.who}</label>
             <div className="flex gap-4 flex-wrap">
               {t.options.org.map(type => (
                 <label key={type} className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                    <input 
                      type="radio" 
                      name="orgType"
                      value={type}
                      checked={formData.orgType === type}
                      onChange={e => setFormData({...formData, orgType: type})}
                      className="accent-neon-purple"
                    />
                    {type}
                 </label>
               ))}
             </div>
          </div>

          <div className="border-t border-white/10 my-4"></div>

          <div className="relative">
            <label className={labelClass}>{t.labels.help}</label>
            <select className={inputClass} value={formData.projectType} onChange={e => setFormData({...formData, projectType: e.target.value})}>
              {t.options.types.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className="absolute right-3 top-[32px] pointer-events-none text-gray-500 text-xs">▼</div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <label className={labelClass}>{t.labels.payment}</label>
              <select className={inputClass} value={formData.paymentType} onChange={e => setFormData({...formData, paymentType: e.target.value})}>
                {t.options.payment.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <div className="absolute right-3 top-[32px] pointer-events-none text-gray-500 text-xs">▼</div>
            </div>
            
            {formData.paymentType !== t.options.payment[1] && (
              <div className="flex-1">
                <label className={labelClass}>{t.labels.budget}</label>
                <input type="number" className={inputClass} placeholder={t.placeholders.budget} value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>{t.labels.desc}</label>
            <textarea 
              className={`${inputClass} h-24 resize-none`} 
              placeholder={t.placeholders.desc}
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div>
             <label className={labelClass}>{t.labels.security}</label>
             <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 text-gray-500" size={16} />
                <input 
                  type="text" 
                  required 
                  className={`${inputClass} pl-10 w-1/3`} 
                  placeholder={t.placeholders.answer}
                  value={formData.captcha}
                  onChange={e => setFormData({...formData, captcha: e.target.value})}
                />
             </div>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-black py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(189,0,255,0.4)] transition-all flex items-center justify-center gap-2 transform hover:scale-[1.01]">
            <Briefcase size={20} /> {t.buttons.analyze}
          </button>
        </form>
      )}

      {/* ANALYSERAR */}
      {status === 'analyzing' && (
        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
          <Loader2 size={48} className="text-neon-cyan animate-spin" />
          <p className="text-gray-300 animate-pulse">{t.buttons.analyzing}</p>
        </div>
      )}

      {/* GODKÄNT */}
      {status === 'approved' && (
        <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-2xl text-center space-y-4 animate-fade-in">
          <div className="flex justify-center"><CheckCircle size={48} className="text-green-400" /></div>
          <h3 className="text-xl font-bold text-white">{t.status.approved}</h3>
          <p className="text-gray-300 text-sm leading-relaxed bg-[#0a0b1e] p-4 rounded-lg border border-white/5">"{analysis?.feedback}"</p>
          <div className="text-xs text-gray-500 uppercase tracking-wider">{t.status.time}: <span className="text-green-400 font-bold">{analysis?.estimatedHours}{t.status.hours}</span></div>
          
          {/* SKICKA-KNAPP */}
          <button onClick={sendRealEmail} disabled={isSending} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-500 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/20">
            {isSending ? <Loader2 className="animate-spin" /> : <Send size={18} />} 
            {isSending ? t.buttons.sending : t.buttons.send}
          </button>
          <button onClick={() => setStatus('idle')} className="text-xs text-gray-500 hover:text-white underline pt-2">{t.buttons.change}</button>
        </div>
      )}

      {/* NEKAT */}
      {status === 'rejected' && (
        <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl text-center space-y-4 animate-fade-in">
          <div className="flex justify-center"><XCircle size={48} className="text-red-400" /></div>
          <h3 className="text-xl font-bold text-white">{t.status.rejected}</h3>
          <p className="text-gray-300 text-sm leading-relaxed bg-[#0a0b1e] p-4 rounded-lg border border-white/5">"{analysis?.feedback}"</p>
          <button onClick={() => setStatus('idle')} className="w-full bg-white/10 text-white py-3 rounded-xl font-bold hover:bg-white/20 transition-all">{t.buttons.change}</button>
        </div>
      )}

    </div>
  );
};

export default HireMe;