import React, { useState } from 'react';
import { Loader2, CheckCircle, XCircle, Briefcase, Send, RefreshCw, User, Mail, Building, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const HireMe = () => {
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
  
  const [status, setStatus] = useState('idle'); // idle, analyzing, approved, rejected, sent
  const [analysis, setAnalysis] = useState(null);
  const [isSending, setIsSending] = useState(false);

  // Slumpa en enkel mattefråga för att stoppa robotar
  const [mathQuestion] = useState({ q: "3 + 4", a: "7" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enkel CAPTCHA-koll
    if (formData.captcha.trim() !== mathQuestion.a) {
      toast.error("Fel svar på säkerhetsfrågan.");
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
      toast.error("Kunde inte nå AI-tjänsten.");
    }
  };

  const sendRealEmail = async () => {
    setIsSending(true);

    const subject = `Ny förfrågan från ${formData.name}: ${formData.projectType}`;
    
    // Mailet som kommer till DIG
    const emailBody = `
NY FÖRFRÅGAN VIA PORTFOLION

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
        body: emailBody
      });

      toast.success('Tack! Din förfrågan har skickats.');
      setStatus('sent'); // Visa success-skärm
      setIsSending(false);
      
    } catch (err) {
      console.error(err);
      toast.error('Kunde inte skicka mailet. Försök igen senare.');
      setIsSending(false);
    }
  };

  const inputClass = "w-full bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white focus:border-neon-purple outline-none transition-colors placeholder-gray-600 appearance-none text-sm";
  const labelClass = "block text-[10px] text-gray-400 uppercase mb-1 font-bold tracking-wider";

  // Success-skärm (När mailet är skickat)
  if (status === 'sent') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 animate-fade-in">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <CheckCircle size={48} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Tack för ditt mail!</h2>
        <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
          Jag har tagit emot din förfrågan. Eftersom jag studerar heltid och har familj, svarar jag och tar mig an projekt i mån av tid. Jag återkommer till dig på <strong>{formData.email}</strong> så snart jag kan!
        </p>
        <button 
          onClick={() => {
            setStatus('idle'); 
            setFormData({ ...formData, name: '', email: '', description: '', captcha: '' });
          }} 
          className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-all"
        >
          Gör en ny förfrågan
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar p-1">
      <h2 className="text-2xl font-bold text-neon-purple mb-2">Anlita mig</h2>
      
      {/* DISCLAIMER - Nu i orange/amber för tydlighet */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg mb-6 text-xs text-amber-100/90 leading-relaxed flex gap-3 items-start shadow-sm">
         <Briefcase className="text-amber-400 shrink-0 mt-0.5" size={18} />
         <p>
           <strong className="text-amber-400 block mb-1 tracking-wide">OBSERVERA:</strong> 
           Jag tar mig an projekt vid sidan av mina heltidsstudier och familjeliv. 
           Detta formulär ger en första AI-bedömning, men jag garanterar inte att jag kan ta uppdraget.
         </p>
      </div>

      {/* FORMULÄR */}
      {status === 'idle' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* KONTAKTUPPGIFTER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Ditt Namn</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-500" size={16} />
                <input type="text" required className={`${inputClass} pl-10`} placeholder="Förnamn Efternamn" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Din Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-500" size={16} />
                <input type="email" required className={`${inputClass} pl-10`} placeholder="namn@exempel.se" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
          </div>

          <div>
             <label className={labelClass}>Vem är du?</label>
             <div className="flex gap-4 flex-wrap">
               {['Privatperson', 'Företag', 'Rekryterare'].map(type => (
                 <label key={type} className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                    <input 
                      type="radio" 
                      name="orgType"
                      value={type}
                      checked={formData.orgType === type}
                      onChange={e => setFormData({...formData, orgType: e.target.value})}
                      className="accent-neon-purple"
                    />
                    {type}
                 </label>
               ))}
             </div>
          </div>

          <div className="border-t border-white/10 my-4"></div>

          {/* PROJEKTINFO */}
          <div className="relative">
            <label className={labelClass}>Typ av Projekt</label>
            <select className={inputClass} value={formData.projectType} onChange={e => setFormData({...formData, projectType: e.target.value})}>
              <option>Hemsida (Enkel)</option>
              <option>Hemsida (Avancerad)</option>
              <option>Systemutveckling / Backend</option>
              <option>AI Integration / Automation</option>
              <option>Annat</option>
            </select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <label className={labelClass}>Ersättning</label>
              <select className={inputClass} value={formData.paymentType} onChange={e => setFormData({...formData, paymentType: e.target.value})}>
                <option>Betalt</option>
                <option>Pro Bono (Gratis/Erfarenhet)</option>
              </select>
            </div>
            
            {formData.paymentType === 'Betalt' && (
              <div className="flex-1">
                <label className={labelClass}>Budget (ca kr)</label>
                <input type="number" className={inputClass} placeholder="t.ex. 5000" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>Beskrivning</label>
            <textarea 
              className={`${inputClass} h-24 resize-none`} 
              placeholder="Vad behöver du hjälp med? Beskriv kort..."
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          {/* CAPTCHA (Säkerhetsfråga) */}
          <div>
             <label className={labelClass}>Säkerhetskoll: Vad är {mathQuestion.q}?</label>
             <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 text-gray-500" size={16} />
                <input 
                  type="text" 
                  required 
                  className={`${inputClass} pl-10 w-1/3`} 
                  placeholder="Svar"
                  value={formData.captcha}
                  onChange={e => setFormData({...formData, captcha: e.target.value})}
                />
             </div>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-black py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(189,0,255,0.4)] transition-all flex items-center justify-center gap-2 transform hover:scale-[1.01]">
            <Briefcase size={20} /> Analysera med AI
          </button>
        </form>
      )}

      {/* STATUSVYN (Laddar, Godkänd, Nekad) */}
      {status === 'analyzing' && (
        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
          <Loader2 size={48} className="text-neon-cyan animate-spin" />
          <p className="text-gray-300 animate-pulse">AI-agenten analyserar...</p>
        </div>
      )}

      {status === 'approved' && (
        <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-2xl text-center space-y-4 animate-fade-in">
          <div className="flex justify-center"><CheckCircle size={48} className="text-green-400" /></div>
          <h3 className="text-xl font-bold text-white">Låter intressant!</h3>
          <p className="text-gray-300 text-sm leading-relaxed bg-[#0a0b1e] p-4 rounded-lg border border-white/5">"{analysis?.feedback}"</p>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Tidsestimat: <span className="text-green-400 font-bold">{analysis?.estimatedHours}h</span></div>
          
          <button onClick={sendRealEmail} disabled={isSending} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-500 transition-all flex items-center justify-center gap-2">
            {isSending ? <Loader2 className="animate-spin" /> : <Send size={18} />} 
            {isSending ? "Skickar..." : "Skicka förfrågan nu"}
          </button>
          <button onClick={() => setStatus('idle')} className="text-xs text-gray-500 hover:text-white underline pt-2">Ändra uppgifter</button>
        </div>
      )}

      {status === 'rejected' && (
        <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl text-center space-y-4 animate-fade-in">
          <div className="flex justify-center"><XCircle size={48} className="text-red-400" /></div>
          <h3 className="text-xl font-bold text-white">Kanske inte just nu...</h3>
          <p className="text-gray-300 text-sm leading-relaxed bg-[#0a0b1e] p-4 rounded-lg border border-white/5">"{analysis?.feedback}"</p>
          <button onClick={() => setStatus('idle')} className="w-full bg-white/10 text-white py-3 rounded-xl font-bold hover:bg-white/20 transition-all">Ändra förfrågan</button>
        </div>
      )}

    </div>
  );
};

export default HireMe;