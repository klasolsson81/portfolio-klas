import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle, XCircle, DollarSign, Briefcase } from 'lucide-react';
import axios from 'axios';

const HireMe = () => {
  const [formData, setFormData] = useState({
    projectType: 'Hemsida (Enkel)',
    paymentType: 'Betalt',
    amount: '',
    description: ''
  });
  
  const [status, setStatus] = useState('idle'); // idle, analyzing, approved, rejected
  const [analysis, setAnalysis] = useState(null);

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
      alert("Något gick fel med AI-analysen.");
    }
  };

  const sendRealEmail = () => {
    const subject = `Förfrågan: ${formData.projectType}`;
    const body = `Hej Klas!%0D%0A%0D%0AJag har fått grönt ljus av din AI.%0D%0A%0D%0AProjekt: ${formData.projectType}%0D%0ABudget: ${formData.amount} kr%0D%0ABeskrivning: ${formData.description}%0D%0A%0D%0AAI-bedömning: ${analysis.estimatedHours} timmar.`;
    window.location.href = `mailto:klasolsson81@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar p-1">
      <h2 className="text-2xl font-bold text-neon-purple mb-2">Anlita mig</h2>
      <p className="text-sm text-gray-400 mb-6">
        Fyll i formuläret så låter jag min AI göra en första bedömning av projektet.
      </p>

      {/* FORMULÄR */}
      {status === 'idle' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 uppercase mb-1">Vad behöver du hjälp med?</label>
            <select 
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-neon-purple outline-none"
              value={formData.projectType}
              onChange={e => setFormData({...formData, projectType: e.target.value})}
            >
              <option>Hemsida (Enkel)</option>
              <option>Hemsida (Avancerad)</option>
              <option>Systemutveckling / Backend</option>
              <option>AI Integration / Automation</option>
              <option>Annat</option>
            </select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 uppercase mb-1">Ersättning?</label>
              <select 
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-neon-purple outline-none"
                value={formData.paymentType}
                onChange={e => setFormData({...formData, paymentType: e.target.value})}
              >
                <option>Betalt</option>
                <option>Pro Bono (Gratis/Erfarenhet)</option>
              </select>
            </div>
            {formData.paymentType === 'Betalt' && (
              <div className="flex-1">
                <label className="block text-xs text-gray-500 uppercase mb-1">Budget (ca kr)</label>
                <input 
                  type="number" 
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-neon-purple outline-none"
                  placeholder="t.ex. 5000"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-500 uppercase mb-1">Beskrivning</label>
            <textarea 
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-neon-purple outline-none h-32 resize-none"
              placeholder="Berätta lite kort om projektet..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="w-full bg-neon-purple/20 border border-neon-purple/50 text-white py-3 rounded-xl font-bold hover:bg-neon-purple hover:text-white transition-all flex items-center justify-center gap-2">
            <Briefcase size={18} /> Analysera Förfrågan
          </button>
        </form>
      )}

      {/* LADDAR */}
      {status === 'analyzing' && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Loader2 size={48} className="text-neon-cyan animate-spin mb-4" />
          <p className="text-gray-300">AI-agenten analyserar projektets omfattning...</p>
        </div>
      )}

      {/* RESULTAT: GODKÄNT */}
      {status === 'approved' && (
        <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-xl text-center space-y-4 animate-fade-in">
          <div className="flex justify-center"><CheckCircle size={48} className="text-green-400" /></div>
          <h3 className="text-xl font-bold text-white">Låter intressant!</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            "{analysis?.feedback}"
          </p>
          <div className="text-xs text-gray-500 bg-black/20 p-2 rounded">
            Uppskattad tid: {analysis?.estimatedHours} timmar
          </div>
          <button onClick={sendRealEmail} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-500 transition-all flex items-center justify-center gap-2">
            <Send size={18} /> Skicka mail till Klas
          </button>
          <button onClick={() => setStatus('idle')} className="text-xs text-gray-500 hover:text-white underline">Gör ny förfrågan</button>
        </div>
      )}

      {/* RESULTAT: NEKAT */}
      {status === 'rejected' && (
        <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl text-center space-y-4 animate-fade-in">
          <div className="flex justify-center"><XCircle size={48} className="text-red-400" /></div>
          <h3 className="text-xl font-bold text-white">Kanske inte just nu...</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            "{analysis?.feedback}"
          </p>
          <div className="text-xs text-gray-500 bg-black/20 p-2 rounded">
            Uppskattad tid: {analysis?.estimatedHours} timmar
          </div>
          <button onClick={() => setStatus('idle')} className="w-full bg-white/10 text-white py-3 rounded-xl font-bold hover:bg-white/20 transition-all">
            Ändra förfrågan
          </button>
        </div>
      )}
    </div>
  );
};

export default HireMe;