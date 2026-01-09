import React, { useState, useRef } from 'react';
import { Loader2, CheckCircle, XCircle, Briefcase, Send, User, Mail } from 'lucide-react';
import apiClient from '../../lib/api/client';
import { toast } from 'sonner';
import ReCAPTCHA from 'react-google-recaptcha';

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
        who: "VEM ÄR DU?"
      },
      placeholders: {
        budget: "t.ex. 5000",
        desc: "Vad behöver du hjälp med? Beskriv kort...",
        name: "Förnamn Efternamn",
        email: "namn@exempel.se"
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
        captcha: "Säkerhetsverifiering misslyckades. Försök igen.",
        ai: "Kunde inte nå AI-tjänsten.",
        mail: "Kunde inte skicka mailet. Försök igen senare."
      },
      emailLabels: {
        header: "NY FÖRFRÅGAN VIA PORTFOLION (SV)",
        sender: "AVSÄNDARE",
        name: "Namn",
        email: "Email",
        type: "Typ",
        project: "PROJEKT",
        projectType: "Typ",
        payment: "Ersättning",
        budget: "Budget",
        description: "BESKRIVNING",
        aiAssessment: "AI-BEDÖMNING",
        time: "Tid",
        hours: "timmar",
        feedback: "Feedback"
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
        who: "WHO ARE YOU?"
      },
      placeholders: {
        budget: "e.g. 5000",
        desc: "What do you need help with? Describe briefly...",
        name: "Firstname Lastname",
        email: "name@example.com"
      }, 
      options: { 
        types: ["Website (Simple)", "Website (Advanced)", "System Development / Backend", "AI Integration / Automation", "Other"], 
        payment: ["Paid", "Pro Bono (Free/Experience)"], 
        org: ["Individual", "Company", "Recruiter"] 
      }, 
      buttons: { 
        analyze: "Analyze with AI", 
        analyzing: "AI agent is analyzing...", 
        send: "Send inquiry now", 
        sending: "Sending...", 
        new: "New inquiry", 
        change: "Edit details" 
      }, 
      status: { 
        approved: "Sounds interesting!", 
        rejected: "Maybe not right now...", 
        time: "TIME ESTIMATE", 
        hours: "h", 
        successTitle: "Thank you!", 
        successMsg: "I've received your inquiry. Since I study full-time and have a family, I respond and take on projects as time allows. I'll get back to you at", 
        soon: "as soon as possible!" 
      }, 
      errors: {
        captcha: "Security verification failed. Please try again.",
        ai: "Could not reach AI service.",
        mail: "Could not send email. Try again later."
      },
      emailLabels: {
        header: "NEW INQUIRY VIA PORTFOLIO (EN)",
        sender: "SENDER",
        name: "Name",
        email: "Email",
        type: "Type",
        project: "PROJECT",
        projectType: "Type",
        payment: "Payment",
        budget: "Budget",
        description: "DESCRIPTION",
        aiAssessment: "AI ASSESSMENT",
        time: "Time",
        hours: "hours",
        feedback: "Feedback"
      }
    }
};

const HireMe = ({ lang, isDark }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.sv;
  const recaptchaRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orgType: t.options.org[0],
    projectType: t.options.types[0],
    paymentType: t.options.payment[0],
    amount: '',
    description: ''
  });
  const [status, setStatus] = useState('idle');
  const [analysis, setAnalysis] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Execute reCAPTCHA
    try {
      const recaptchaToken = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset(); // Reset for next submission

      // Verify reCAPTCHA token with our backend
      const verifyResponse = await apiClient.post('/api/verify-recaptcha', {
        token: recaptchaToken
      });

      if (!verifyResponse.data.success) {
        toast.error(t.errors.captcha);
        return;
      }

      // reCAPTCHA verified, proceed with AI analysis
      setStatus('analyzing');
      try {
        const res = await apiClient.post('/api/analyze', formData);
        setAnalysis(res.data);
        setStatus(res.data.approved ? 'approved' : 'rejected');
      } catch (err) {
        setStatus('idle');
        // Specific error message for AI analysis failure (overrides interceptor toast)
        toast.error(t.errors.ai);
      }
    } catch (recaptchaError) {
      // reCAPTCHA execution or verification failed
      toast.error(t.errors.captcha);
      console.error('reCAPTCHA error:', recaptchaError);
    }
  };

  const sendRealEmail = async () => { 
    setIsSending(true); 
    
    const el = t.emailLabels;
    const subject = `Ny förfrågan från ${formData.name}: ${formData.projectType}`;
    
    const emailBody = `${el.header}

${el.sender}:
${el.name}: ${formData.name}
${el.email}: ${formData.email}
${el.type}: ${formData.orgType}

${el.project}:
${el.projectType}: ${formData.projectType}
${el.payment}: ${formData.paymentType}${formData.amount ? `\n${el.budget}: ${formData.amount} kr` : ''}

${el.description}:
${formData.description}

---

${el.aiAssessment}:
${el.time}: ${analysis?.estimatedHours || '?'} ${el.hours}
${el.feedback}: "${analysis?.feedback || 'N/A'}"`;

    try {
    await apiClient.post('/api/email', {
      subject,
      body: emailBody,
      replyTo: formData.email,
      senderName: formData.name,
      // NYTT: Skicka med verifieringsdata till backend
      verificationToken: analysis.verificationToken,
      analysisData: {
        status: analysis.status,
        estimatedHours: analysis.estimatedHours
      }
    });
    toast.success(t.status.successTitle);
    setStatus('sent');
  } catch (err) {
    toast.error(t.errors.mail);
  } finally {
    setIsSending(false);
  }
};

  // Transparenta inputs för ljust läge
  const inputClass = `w-full rounded-lg p-3 outline-none transition-colors text-sm border appearance-none
    ${isDark 
      ? 'bg-[#1a1b2e] border-white/10 text-white placeholder-gray-600 focus:border-neon-purple'
      : 'bg-orange-50/50 backdrop-blur-sm border-orange-200/50 text-warm-text placeholder-orange-400 focus:border-warm-accent'}`;

  // Warm labels for light mode
  const labelClass = `block text-[10px] uppercase mb-1 font-bold tracking-wider transition-colors
    ${isDark ? 'text-gray-400' : 'text-warm-accent'}`;

  if (status === 'sent') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 animate-fade-in">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <CheckCircle size={48} className="text-green-400" />
        </div>
        <h2 className={`text-3xl font-bold mb-2 transition-colors ${isDark ? 'text-white' : 'text-warm-text'}`}>{t.status.successTitle}</h2>
        <p className={`max-w-md mb-8 leading-relaxed transition-colors ${isDark ? 'text-gray-400' : 'text-warm-muted'}`}>
          {t.status.successMsg} <strong>{formData.email}</strong> {t.status.soon}
        </p>
        
        <button
          onClick={() => {
            setStatus('idle');
            setFormData({
              name: '',
              email: '',
              orgType: t.options.org[0],
              projectType: t.options.types[0],
              paymentType: t.options.payment[0],
              amount: '',
              description: ''
            });
          }} 
          className="px-8 py-3 bg-transparent border border-green-500/30 text-green-500 hover:bg-green-500/10 hover:border-green-500 hover:text-green-600 rounded-full font-medium transition-all"
        >
          {t.buttons.new}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col p-1 pb-10"> 
      <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-neon-purple' : 'text-warm-accent'}`}>{t.title}</h2>
      
      {/* Transparent disclaimer box */}
      <div className={`border p-4 rounded-lg mb-6 text-xs leading-relaxed flex gap-3 items-start shadow-sm transition-colors
        ${isDark 
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-100/90' 
          : 'bg-amber-100/40 backdrop-blur-sm border-amber-300/50 text-amber-800'}`}>
         <Briefcase className="text-amber-500 shrink-0 mt-0.5" size={18} />
         <p>{t.disclaimer}</p>
      </div>

      {status === 'idle' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t.labels.name}</label>
              <div className="relative">
                <User className={`absolute left-3 top-3 ${isDark ? 'text-gray-500' : 'text-orange-400'}`} size={16} />
                <input type="text" required className={`${inputClass} pl-10`} placeholder={t.placeholders.name} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>
            <div>
              <label className={labelClass}>{t.labels.email}</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-3 ${isDark ? 'text-gray-500' : 'text-orange-400'}`} size={16} />
                <input type="email" required className={`${inputClass} pl-10`} placeholder={t.placeholders.email} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
          </div>

          <div>
             <label className={labelClass}>{t.labels.who}</label>
             <div className="flex gap-4 flex-wrap">
               {t.options.org.map((type, index) => (
                 <label key={type} className={`flex items-center gap-2 cursor-pointer text-sm transition-colors ${isDark ? 'text-gray-300' : 'text-warm-text'}`}>
                    <input
                      type="radio"
                      name="orgType"
                      value={type}
                      checked={formData.orgType === type}
                      onChange={e => setFormData({...formData, orgType: type})}
                      className="accent-warm-accent" 
                    />
                    {type}
                 </label>
               ))}
             </div>
          </div>

          <div className={`border-t my-4 transition-colors ${isDark ? 'border-white/10' : 'border-orange-200/50'}`}></div>

          <div className="relative">
            <label className={labelClass}>{t.labels.help}</label>
            <select className={inputClass} value={formData.projectType} onChange={e => setFormData({...formData, projectType: e.target.value})}>
              {t.options.types.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className={`absolute right-3 top-[32px] pointer-events-none text-xs ${isDark ? 'text-gray-500' : 'text-orange-400'}`}>▼</div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <label className={labelClass}>{t.labels.payment}</label>
              <select className={inputClass} value={formData.paymentType} onChange={e => setFormData({...formData, paymentType: e.target.value})}>
                {t.options.payment.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <div className={`absolute right-3 top-[32px] pointer-events-none text-xs ${isDark ? 'text-gray-500' : 'text-orange-400'}`}>▼</div>
            </div>
            
            {formData.paymentType === t.options.payment[0] && (
              <div className="flex-1">
                <label className={labelClass}>{t.labels.budget}</label>
                <input type="number" className={inputClass} placeholder={t.placeholders.budget} value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>{t.labels.desc}</label>
            <textarea className={`${inputClass} h-24 resize-none`} placeholder={t.placeholders.desc} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          </div>

          {/* Invisible reCAPTCHA v3 */}
          <ReCAPTCHA
            ref={recaptchaRef}
            size="invisible"
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
          />

          <button type="submit" className="w-full bg-gradient-to-r from-warm-accent to-warm-accentDark text-white py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(210,105,30,0.4)] transition-all flex items-center justify-center gap-2 transform hover:scale-[1.01]">
            <Briefcase size={20} /> {t.buttons.analyze}
          </button>
        </form>
      )}

      {status === 'analyzing' && (
        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
          <Loader2 size={48} className={`animate-spin ${isDark ? 'text-neon-cyan' : 'text-warm-accent'}`} />
          <p className={`animate-pulse transition-colors ${isDark ? 'text-gray-300' : 'text-warm-accent'}`}>{t.buttons.analyzing}</p>
        </div>
      )}

      {status === 'approved' && (
        <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-2xl text-center space-y-4 animate-fade-in">
          <div className="flex justify-center"><CheckCircle size={48} className="text-green-500" /></div>
          <h3 className={`text-xl font-bold transition-colors ${isDark ? 'text-white' : 'text-warm-text'}`}>{t.status.approved}</h3>
          <p className={`text-sm leading-relaxed p-4 rounded-lg border transition-colors ${isDark ? 'bg-[#0a0b1e] border-white/5 text-gray-300' : 'bg-orange-50/30 backdrop-blur-sm border-orange-200/50 text-warm-text'}`}>"{analysis?.feedback}"</p>
          <div className={`text-xs uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-warm-muted'}`}>{t.status.time}: <span className="text-green-500 font-bold">{analysis?.estimatedHours}{t.status.hours}</span></div>
          <button onClick={sendRealEmail} disabled={isSending} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-500 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/20">
            {isSending ? <Loader2 className="animate-spin" /> : <Send size={18} />} {isSending ? t.buttons.sending : t.buttons.send}
          </button>
          <button onClick={() => setStatus('idle')} className={`text-xs hover:underline pt-2 transition-colors ${isDark ? 'text-gray-500 hover:text-green-600' : 'text-warm-muted hover:text-green-600'}`}>{t.buttons.change}</button>
        </div>
      )}

      {status === 'rejected' && (
        <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl text-center space-y-4 animate-fade-in">
          <div className="flex justify-center"><XCircle size={48} className="text-red-500" /></div>
          <h3 className={`text-xl font-bold transition-colors ${isDark ? 'text-white' : 'text-warm-text'}`}>{t.status.rejected}</h3>
          <p className={`text-sm leading-relaxed p-4 rounded-lg border transition-colors ${isDark ? 'bg-[#0a0b1e] border-white/5 text-gray-300' : 'bg-orange-50/30 backdrop-blur-sm border-orange-200/50 text-warm-text'}`}>"{analysis?.feedback}"</p>
          <button onClick={() => setStatus('idle')} className={`w-full py-3 rounded-xl font-bold transition-all border ${isDark ? 'bg-white/10 text-white border-white/10 hover:bg-white/20' : 'bg-orange-50/30 backdrop-blur-sm text-warm-text border-orange-200/50 hover:bg-orange-50/50'}`}>{t.buttons.change}</button>
        </div>
      )}

    </div>
  );
};

export default HireMe;