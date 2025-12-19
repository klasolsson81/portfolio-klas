import React from 'react';
import { X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PrivacyPolicy = ({ isOpen, onClose, isDark, lang }) => {
  const text = {
    sv: {
      title: 'Integritetspolicy',
      intro: 'Denna integritetspolicy förklarar hur klasolsson.se samlar in och använder data.',
      lastUpdated: 'Senast uppdaterad',
      sections: [
        {
          title: '1. Insamlade Data',
          content: [
            '📊 **Vercel Analytics:** Samlar in anonymiserad data om sidvisningar, klick och session-varaktighet för att förbättra webbplatsen.',
            '⚡ **Vercel Speed Insights:** Mäter prestanda-metrics (Core Web Vitals) för att optimera laddningstider.',
            '🛡️ **Google reCAPTCHA v3:** Används för spam-skydd på kontaktformuläret. Google samlar in beteendedata (musrörelser, tangenttryckningar, IP-adress) för att upptäcka robotar.',
            '💬 **OpenAI ChatGPT API:** Dina chattfrågor skickas till OpenAI för att generera svar. OpenAI har ett GDPR Data Processing Agreement (DPA).',
            '📝 **SessionStorage:** Chat-historik sparas tillfälligt i din webbläsare och raderas automatiskt när du stänger fliken.',
            '🍪 **LocalStorage:** Vi sparar ditt cookie-samtycke och PWA-installations-inställningar lokalt i din webbläsare.'
          ]
        },
        {
          title: '2. Cookies',
          content: [
            '**Nödvändiga cookies:** PWA-installation och cookie-samtycke (tekniskt nödvändiga, kräver inget samtycke).',
            '**Analytics cookies:** Vercel Analytics och Speed Insights (kräver samtycke).',
            '**Tredjepartscookies:** Google reCAPTCHA (kräver samtycke).',
            '',
            'Du kan när som helst ändra ditt cookie-samtycke genom att radera "cookie-consent" i webbläsarens localStorage och ladda om sidan.'
          ]
        },
        {
          title: '3. Dina Rättigheter (GDPR)',
          content: [
            '✅ **Rätt till tillgång:** Du kan begära en kopia av dina personuppgifter.',
            '✅ **Rätt till radering:** Du kan begära att vi raderar dina uppgifter.',
            '✅ **Rätt till rättelse:** Du kan begära att vi korrigerar felaktig data.',
            '✅ **Rätt till dataportabilitet:** Du kan begära dina data i ett maskinläsbart format.',
            '✅ **Rätt att invända:** Du kan invända mot viss databehandling.',
            '',
            'För att utöva dina rättigheter, kontakta: klasolsson81@gmail.com'
          ]
        },
        {
          title: '4. Datadelning',
          content: [
            '🔹 **Vercel Inc.** (hosting och analytics) - baserat i USA med GDPR-garanti.',
            '🔹 **Google LLC** (reCAPTCHA) - baserat i USA med EU-US Data Privacy Framework.',
            '🔹 **OpenAI** (ChatGPT API) - baserat i USA med GDPR Data Processing Agreement.',
            '',
            'Vi säljer ALDRIG dina personuppgifter till tredje part.'
          ]
        },
        {
          title: '5. Datasäkerhet',
          content: [
            '🔒 All kommunikation krypteras med HTTPS/TLS.',
            '🔒 API-nycklar lagras säkert i Vercels miljövariabler (ej exponerade i frontend).',
            '🔒 Input-sanitering skyddar mot XSS-attacker.',
            '🔒 Rate limiting (10 req/min) skyddar mot missbruk.'
          ]
        },
        {
          title: '6. Kontakt',
          content: [
            '📧 **E-post:** klasolsson81@gmail.com',
            '🌐 **Webbplats:** https://klasolsson.se',
            '💼 **LinkedIn:** https://www.linkedin.com/in/klasolsson81/',
            '',
            'För frågor om integritet eller GDPR, kontakta oss via e-post.'
          ]
        }
      ]
    },
    en: {
      title: 'Privacy Policy',
      intro: 'This privacy policy explains how klasolsson.se collects and uses data.',
      lastUpdated: 'Last updated',
      sections: [
        {
          title: '1. Data Collection',
          content: [
            '📊 **Vercel Analytics:** Collects anonymized data about page views, clicks, and session duration to improve the website.',
            '⚡ **Vercel Speed Insights:** Measures performance metrics (Core Web Vitals) to optimize loading times.',
            '🛡️ **Google reCAPTCHA v3:** Used for spam protection on the contact form. Google collects behavioral data (mouse movements, keystrokes, IP address) to detect bots.',
            '💬 **OpenAI ChatGPT API:** Your chat questions are sent to OpenAI to generate responses. OpenAI has a GDPR Data Processing Agreement (DPA).',
            '📝 **SessionStorage:** Chat history is temporarily saved in your browser and automatically deleted when you close the tab.',
            '🍪 **LocalStorage:** We save your cookie consent and PWA installation preferences locally in your browser.'
          ]
        },
        {
          title: '2. Cookies',
          content: [
            '**Essential cookies:** PWA installation and cookie consent (technically necessary, no consent required).',
            '**Analytics cookies:** Vercel Analytics and Speed Insights (consent required).',
            '**Third-party cookies:** Google reCAPTCHA (consent required).',
            '',
            'You can change your cookie consent at any time by deleting "cookie-consent" in your browser\'s localStorage and reloading the page.'
          ]
        },
        {
          title: '3. Your Rights (GDPR)',
          content: [
            '✅ **Right to access:** You can request a copy of your personal data.',
            '✅ **Right to erasure:** You can request that we delete your data.',
            '✅ **Right to rectification:** You can request that we correct inaccurate data.',
            '✅ **Right to data portability:** You can request your data in a machine-readable format.',
            '✅ **Right to object:** You can object to certain data processing.',
            '',
            'To exercise your rights, contact: klasolsson81@gmail.com'
          ]
        },
        {
          title: '4. Data Sharing',
          content: [
            '🔹 **Vercel Inc.** (hosting and analytics) - based in USA with GDPR guarantees.',
            '🔹 **Google LLC** (reCAPTCHA) - based in USA with EU-US Data Privacy Framework.',
            '🔹 **OpenAI** (ChatGPT API) - based in USA with GDPR Data Processing Agreement.',
            '',
            'We NEVER sell your personal data to third parties.'
          ]
        },
        {
          title: '5. Data Security',
          content: [
            '🔒 All communication is encrypted with HTTPS/TLS.',
            '🔒 API keys are stored securely in Vercel environment variables (not exposed in frontend).',
            '🔒 Input sanitization protects against XSS attacks.',
            '🔒 Rate limiting (10 req/min) protects against abuse.'
          ]
        },
        {
          title: '6. Contact',
          content: [
            '📧 **Email:** klasolsson81@gmail.com',
            '🌐 **Website:** https://klasolsson.se',
            '💼 **LinkedIn:** https://www.linkedin.com/in/klasolsson81/',
            '',
            'For questions about privacy or GDPR, contact us via email.'
          ]
        }
      ]
    }
  };

  const t = text[lang] || text.sv;
  const today = new Date().toISOString().split('T')[0];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border custom-scrollbar
            ${isDark
              ? 'bg-[#1a1b2e]/95 border-white/10'
              : 'bg-white/95 border-purple-200/50'}`}
        >
          {/* Header */}
          <div className={`sticky top-0 z-10 p-6 border-b backdrop-blur-xl
            ${isDark
              ? 'bg-[#1a1b2e]/95 border-white/10'
              : 'bg-white/95 border-purple-200/50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-neon-cyan/20' : 'bg-purple-100'}`}>
                  <Shield className={isDark ? 'text-neon-cyan' : 'text-purple-600'} size={24} />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>
                    {t.title}
                  </h2>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-purple-600'}`}>
                    {t.lastUpdated}: {today}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors
                  ${isDark
                    ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                    : 'hover:bg-purple-100 text-purple-600 hover:text-purple-900'}`}
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-purple-700'}`}>
              {t.intro}
            </p>

            {t.sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className={`text-lg font-bold ${isDark ? 'text-neon-cyan' : 'text-purple-700'}`}>
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.content.map((line, lineIdx) => {
                    if (line === '') return <div key={lineIdx} className="h-2" />;

                    // Check if line contains markdown-style bold (**text**)
                    const parts = line.split(/(\*\*.*?\*\*)/g);

                    return (
                      <p key={lineIdx} className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-purple-700'}`}>
                        {parts.map((part, partIdx) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return (
                              <strong key={partIdx} className={`font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>
                                {part.slice(2, -2)}
                              </strong>
                            );
                          }
                          return part;
                        })}
                      </p>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PrivacyPolicy;
