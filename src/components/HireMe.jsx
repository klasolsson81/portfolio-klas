import React, { useState } from 'react';
import { Loader2, CheckCircle, XCircle, Briefcase, Send, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const HireMe = () => {
  const [formData, setFormData] = useState({
    projectType: 'Hemsida (Enkel)',
    paymentType: 'Betalt',
    amount: '',
    description: ''
  });
  
  const [status, setStatus] = useState('idle'); 
  const [analysis, setAnalysis] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('analyzing');

    try {
      const res = await axios.post('/api/analyze', formData);
      setAnalysis(res.data);
      setStatus(res.data.approved ? 'approved' : 'rejected');
    } catch (err) {
      console.error(err);
      setStatus('idle');
      toast.error("Något gick fel med AI-analysen.");
    }
  };

  // HÄR ÄR ÄNDRINGEN: Anropar din egen backend
  const sendRealEmail = async () => {
    setIsSending(true);

    const subject = `Ny förfrågan: ${formData.projectType}`;
    
    // Snyggt formaterat mail till dig själv
    const emailBody = `
HEJ KLAS!
Du har fått en ny förfrågan via din portfolio.

PROJEKT: ${formData.projectType}
ERSÄTTNING: ${formData.paymentType} ${formData.amount ? `(${formData.amount} kr)` : ''}

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

      toast.success('Förfrågan skickad! Jag hör av mig.');
      setIsSending(false);
      setStatus('idle');
      setFormData({ projectType: 'Hemsida (Enkel)', paymentType: 'Betalt', amount: '', description: '' });
      
    } catch (err) {
      console.error(err);
      toast.error('Kunde inte skicka mailet. Försök igen senare.');
      setIsSending(false);
    }
  };

  const inputClass = "w-full bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white focus:border-neon-purple outline-none transition-colors placeholder-gray-600 appearance-none";

  return (
    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar p-1">
      <h2 className="text-2xl font-bold text-neon-purple mb-2">Anlita mig</h2>
      <p className="text-sm text-gray-400 mb-6">
        Fyll i formuläret så låter jag min AI göra en första bedömning av projektet.
      </p>

      {/* FORMULÄR */}
      {status === 'idle' && (
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Projekt-val */}
          <div className="relative">
            <label className="block text-xs text-gray-500 uppercase mb-1 font-bold tracking-wider">Vad behöver du hjälp med?</label>
            <select 
              className={inputClass}
              value={formData.projectType}
              onChange={e => setFormData({...formData, projectType: e.target.value})}
            >
              <option>Hemsida (Enkel)</option>
              <option>Hemsida (Avancerad)</option>
              <option>Systemutveckling / Backend</option>
              <option>AI Integration / Automation</option>
              <option>Annat</option>
            </select>
            <div className="absolute right-3 top-[34px] pointer-events-none text-gray-500">▼</div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <label className="block text-xs text-gray-500 uppercase mb-1 font-bold tracking-wider">Ersättning?</label>
              <select 
                className={inputClass}
                value={formData.paymentType}
                onChange={e => setFormData({...formData, paymentType: e.target.value})}
              >
                <option>Betalt</option>
                <option>Pro Bono (Gratis/Erfarenhet)</option>
              </select>
              <div className="absolute right-3 top-[34px] pointer-events-none text-gray-500">▼</div>
            </div>
            
            {formData.paymentType === 'Betalt' && (
              <div className="flex-1">
                <label className="block text-xs text-gray-500 uppercase mb-1 font-bold tracking-wider">Budget (ca kr)</label>
                <input 
                  type="number" 
                  className={inputClass}
                  placeholder="t.ex. 5000"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-500 uppercase mb-1 font-bold tracking-wider">Beskrivning</label>
            <textarea 
              className={`${inputClass} h-32 resize-none`}
              placeholder="Berätta lite kort om projektet..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-black py-3.5 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(189,0,255,0.4)] transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]">
            <Briefcase size={20} /> Analysera Förfrågan
          </button>
        </form>
      )}

      {/* LADDAR */}
      {status === 'analyzing' && (
        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-neon-purple blur-xl opacity-20 rounded-full"></div>
            <Loader2 size={56} className="text-neon-cyan animate-spin relative z-10" />
          </div>
          <p className="text-gray-300 animate-pulse">AI-agenten analyserar projektets omfattning...</p>
        </div>
      )}

      {/* RESULTAT: GODKÄNT */}
      {status === 'approved' && (
        <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-2xl text-center space-y-5 animate-fade-in">
          <div className="flex justify-center">
            <div className="bg-green-500/20 p-3 rounded-full">
              <CheckCircle size={48} className="text-green-400" />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Låter intressant!</h3>
            <p className="text-gray-300 text-sm leading-relaxed bg-[#0a0b1e] p-4 rounded-lg border border-white/5">
              "{analysis?.feedback}"
            </p>
          </div>

          <div className="text-xs text-gray-500 uppercase tracking-wider">
            Uppskattad tid: <span className="text-green-400 font-bold">{analysis?.estimatedHours} timmar</span>
          </div>

          <div className="space-y-3 pt-2">
            <button 
              onClick={sendRealEmail} 
              disabled={isSending}
              className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-500 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/20 transform hover:scale-[1.02] disabled:opacity-50"
            >
              {isSending ? <Loader2 className="animate-spin" /> : <Send size={18} />} 
              {isSending ? "Skickar..." : "Skicka förfrågan nu"}
            </button>
            
            <button onClick={() => setStatus('idle')} className="w-full bg-white/5 text-gray-300 py-3.5 rounded-xl font-medium hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2 border border-white/5">
              <RefreshCw size={18} /> Gör ny förfrågan
            </button>
          </div>
        </div>
      )}

      {/* RESULTAT: NEKAT */}
      {status === 'rejected' && (
        <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl text-center space-y-5 animate-fade-in">
          <div className="flex justify-center">
            <div className="bg-red-500/20 p-3 rounded-full">
              <XCircle size={48} className="text-red-400" />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Kanske inte just nu...</h3>
            <p className="text-gray-300 text-sm leading-relaxed bg-[#0a0b1e] p-4 rounded-lg border border-white/5">
              "{analysis?.feedback}"
            </p>
          </div>

          <div className="text-xs text-gray-500 uppercase tracking-wider">
            Uppskattad tid: <span className="text-red-400 font-bold">{analysis?.estimatedHours} timmar</span>
          </div>

          <div className="pt-2">
            <button onClick={() => setStatus('idle')} className="w-full bg-white/10 text-white py-3.5 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/10">
              <RefreshCw size={18} /> Ändra förfrågan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HireMe;