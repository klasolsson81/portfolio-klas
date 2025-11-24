# 🚀 Min Interaktiva Portfolio

Detta är källkoden till min personliga portfolio. Sidan är byggd för att vara mer än bara ett CV – den är en interaktiv upplevelse med en integrerad AI-agent och smarta verktyg.

🔗 **Live Demo:** [www.klasolsson.se](https://www.klasolsson.se)

## 🛠 Teknisk Stack
* **Frontend:** React (Vite), Tailwind CSS
* **Animation:** Framer Motion
* **3D:** Three.js / React Three Fiber
* **AI:** OpenAI API (GPT-4o), Vercel Serverless Functions
* **Backend:** Nodemailer (SMTP) för e-posthantering
* **Deployment:** Vercel (CI/CD)

## ✨ Huvudfunktioner
* **🤖 AI-Chatbot:** En RAG-liknande agent som svarar på frågor om min kompetens och bakgrund (med min personlighet!).
* **💼 AI-driven Offertanalys:** Ett "Anlita mig"-formulär där en AI-agent agerar projektledare, bedömer inkommande förfrågningar baserat på min tidsplan och ger direkt feedback till kunden.
* **📧 Egen Mail-Backend:** Byggde bort beroendet av tredjepartstjänster och skapade en egen API-endpoint för att skicka mail via Gmail SMTP.
* **📊 Github Integration:** Visar min kod-aktivitet live med en snyggt stylad heatmap.
* **📱 Responsiv Design:** Optimerad för allt från mobil till ultrawide-skärmar med anpassade layouter.
* **🔍 Case Studies:** Djupdykningar i mina projekt med slideshows och tekniska förklaringar.

## 📦 Kör lokalt
1.  Klona repot.
2.  `npm install`
3.  Skapa en `.env` fil med:
    * `OPENAI_API_KEY`
    * `GMAIL_USER`
    * `GMAIL_PASS`
4.  `npm run dev`