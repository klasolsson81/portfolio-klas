# 🚀 Klas Olsson - Interactive Portfolio PWA

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-klasolsson.se-purple?style=for-the-badge&logo=vercel)](https://klasolsson.se)
[![PWA](https://img.shields.io/badge/PWA-Enabled-success?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)
[![Test Coverage](https://img.shields.io/badge/Coverage-84%25-brightgreen?style=for-the-badge&logo=vitest)](https://vitest.dev/)
[![Accessibility](https://img.shields.io/badge/WCAG-Compliant-blue?style=for-the-badge&logo=accessibility)](https://www.w3.org/WAI/WCAG21/quickref/)

**En fullfjädrad Progressive Web App med AI-driven chatbot, 3D-animationer, och enterprise-grade säkerhet.**

[🌐 Live Demo](https://klasolsson.se) • [📖 Documentation](./CLAUDE.md) • [🔍 Code Review](./CODE_REVIEW.md)

</div>

---

## 📋 Innehållsförteckning

- [Om Projektet](#-om-projektet)
- [Funktioner](#-funktioner)
- [Teknisk Stack](#-teknisk-stack)
- [Snabbstart](#-snabbstart)
- [PWA-Funktioner](#-pwa-funktioner)
- [Utveckling](#-utveckling)
- [Testning](#-testning)
- [Deployment](#-deployment)
- [Säkerhet](#-säkerhet)
- [Prestanda](#-prestanda)
- [Tillgänglighet](#-tillgänglighet)
- [Projektstatistik](#-projektstatistik)
- [Licens](#-licens)

---

## 🎯 Om Projektet

En **moderna, interaktiv portfolio-webbplats** byggd med React och Three.js som går långt bortom ett traditionellt CV. Portfolion är en **Progressive Web App (PWA)** som fungerar offline, är installbar på alla enheter, och levererar en desktop-app-liknande upplevelse.

### 🌟 Vad Gör Detta Projekt Unikt?

- **🤖 AI-Driven Interaktivitet:** GPT-4o-baserad chatbot som känner till min bakgrund, erfarenhet och projekt
- **🎨 3D-Animationer:** Interactive particle network bakgrund byggd med Three.js
- **📱 PWA-Först Approach:** Installbar, fungerar offline, auto-uppdaterar
- **♿ Tillgänglig:** WCAG-kompatibel med full tangentbords- och screen reader-support
- **🔒 Enterprise-Grade Säkerhet:** XSS-skydd, rate limiting, reCAPTCHA v3
- **⚡ Optimerad Prestanda:** Offline-caching, lazy loading, 82% mindre token-användning
- **✅ Hög Testtäckning:** 84% code coverage med 40+ automatiserade tester

---

## ✨ Funktioner

### 🤖 **AI-Powered Chatbot**
- **OpenAI GPT-4o** integration med anpassad persona
- Bilingual support (Svenska/Engelska)
- Konversationshistorik med localStorage-persistens
- Sanitized inputs med XSS-skydd
- Rate limiting (10 req/min per IP)
- Streaming responses med typing-indikator

### 🎨 **3D Interactive Bakgrund**
- **Three.js** particle network med animerade connections
- Mouse-responsiv partikelrörelse
- Smooth kamera-animationer
- Prestanda-optimerad rendering med Suspense
- Olika visuella stilar för mörk/ljust tema

### 📱 **Progressive Web App (PWA)**
- **Installbar** på alla plattformar (desktop + mobile)
- **Offline-först** med service worker-caching
- Custom installationsprompt med 7-dagars dismiss-minne
- App shortcuts (direkt länk till AI-chatt)
- Auto-uppdatering när ny version deployas
- Splash screen och standalone app-läge

### 🍪 **GDPR-Compliant Cookie Consent**
- Non-intrusive cookie consent banner
- Accept/Reject options med bilingual support
- localStorage persistence för användarval
- Conditional analytics loading (endast med samtycke)
- Custom event system för cross-component communication
- Privacy policy modal med ESC-stöd och loading skeleton
- Automatisk analytics-aktivering baserat på consent
- Development-only logging (clean production console)

### ♿ **WCAG-Compliant Accessibility**
- Komplett tangentbordsnavigering (Tab, Enter, Space, Escape)
- ARIA-labels på alla interaktiva element
- Screen reader-support
- Focus management för modaler
- Semantisk HTML-struktur
- Bilingual accessibility labels

### 📊 **GitHub Stats Integration**
- Live contributions calendar från GitHub API
- Total contributions counter
- Themed styling matching portfolio design
- NetworkFirst caching (1 timme expiration)

### 🌐 **Bilingual Support**
- **Svenska** och **Engelska**
- Auto-detektering av browser-språk
- Instant language switching
- Alla UI-element översatta (timeline, chat, formulär)
- Språkpreferens i localStorage

### 🎬 **Project Showcases**
- Interactive timeline med filterbara event types
- Expandable project cards med teknologi-tags
- Modal slideshows för projekt deep-dives
- Video demos med fullscreen preview
- Extern länkar till live demos

### 📧 **Smart Kontaktformulär**
- reCAPTCHA v3 bot-skydd (score-based)
- Server-side input validation
- Real-time formulärvalidering
- Email sanitization och säkerhetschecks
- Toast notifications för feedback

### 🎨 **Tema-System**
- **Dark mode:** Cyber aesthetic (neon cyan/magenta)
- **Light mode:** Solar tech aesthetic (purple/teal)
- Smooth 700ms transitions
- Animerade gradient-bakgrunder
- Glassmorphism card-designs
- Persistent tema-preferens

### 🚀 **Prestanda & Optimering**
- Vite build system för snabb development
- Lazy loading av bilder och komponenter
- Code splitting för optimal bundle size
- Google Fonts caching (1 år)
- Error boundaries för graceful degradation
- Structured logging för production monitoring

---

## 🛠 Teknisk Stack

### **Frontend**
- **React 18.2** - UI framework
- **Vite 5.4** - Build tool & dev server
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Framer Motion 11.0** - Animation library
- **Three.js 0.161** + React Three Fiber 8.15 - 3D graphics
- **Lucide React 0.330** - Icon library

### **Backend & APIs**
- **OpenAI API 4.28** - GPT-4o chatbot
- **Vercel Serverless Functions** - API endpoints
- **GitHub GraphQL API** - Contribution calendar
- **reCAPTCHA v3** - Bot protection

### **PWA & Offline**
- **vite-plugin-pwa 0.21** - PWA configuration
- **Workbox** - Service worker & caching strategies
- **sharp 0.33** - Image processing för ikoner

### **Testing & Quality**
- **Vitest** - Test framework
- **React Testing Library** - Component testing
- **@vitest/coverage-v8** - Code coverage
- **84% test coverage** - 40+ tester

### **Analytics & Monitoring**
- **Vercel Analytics** - User behavior tracking
- **Vercel Speed Insights** - Core Web Vitals
- **Structured Logging** - JSON-formatted logs

### **Security**
- **DOMPurify-style Sanitization** - XSS protection
- **Rate Limiting** - IP-based throttling
- **reCAPTCHA v3** - Bot detection
- **Environment Variable Validation** - Startup checks

### **Deployment**
- **Vercel** - Hosting & CI/CD
- **GitHub** - Version control
- **Custom Domain** - klasolsson.se med SSL

---

## 🚀 Snabbstart

### **Förutsättningar**

- **Node.js 18+** och npm
- **Git**
- **OpenAI API Key** ([hämta här](https://platform.openai.com/api-keys))
- **reCAPTCHA Keys** ([hämta här](https://www.google.com/recaptcha/admin/create))

### **Installation**

1. **Klona repot**
   ```bash
   git clone https://github.com/klasolsson81/portfolio-klas.git
   cd portfolio-klas
   ```

2. **Installera dependencies**
   ```bash
   npm install
   ```

3. **Skapa `.env` fil**
   ```bash
   # OpenAI API (required)
   OPENAI_API_KEY=sk-your-openai-api-key

   # reCAPTCHA v3 (required för contact form)
   RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
   VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
   ```

4. **Generera PWA-ikoner** (körs automatiskt vid build, men kan köras manuellt)
   ```bash
   node scripts/generate-icons.js
   ```

5. **Starta development server**
   ```bash
   npm run dev
   ```

6. **Öppna i browser**
   ```
   http://localhost:5173
   ```

---

## 📱 PWA-Funktioner

### **Installera Appen**

#### **Desktop (Chrome/Edge/Brave)**
1. Besök https://klasolsson.se
2. Klicka på install-ikonen i address bar (eller vänta på custom prompt)
3. Klicka "Installera" i dialogen
4. Appen öppnas i standalone window

#### **Mobile (iOS Safari)**
1. Besök https://klasolsson.se i Safari
2. Tryck på "Dela"-knappen
3. Scrolla ner och välj "Lägg till på hemskärmen"
4. Bekräfta namnet och tryck "Lägg till"

#### **Mobile (Android Chrome)**
1. Besök https://klasolsson.se i Chrome
2. Tryck på "Lägg till på hemskärmen" i popup
3. Eller: Meny → "Lägg till på hemskärmen"

### **Offline-Funktionalitet**

- ✅ **App shell** (HTML, CSS, JS) cachas automatiskt
- ✅ **Statiska assets** (bilder, fonts, ikoner) cachas
- ✅ **Google Fonts** cachas i 1 år
- ✅ **GitHub API** cachas i 1 timme
- ✅ Fungerar helt offline efter första besöket
- ✅ Auto-uppdaterar när ny version finns

### **Service Worker Strategies**

```javascript
// Google Fonts - CacheFirst (1 år)
- fonts.googleapis.com
- fonts.gstatic.com

// GitHub API - NetworkFirst (1 timme)
- api.github.com

// Static Assets - Precache
- *.js, *.css, *.html, *.png, *.svg, *.jpg, *.woff2
```

---

## 💻 Utveckling

### **Tillgängliga Kommandon**

```bash
# Starta development server med hot reload
npm run dev

# Bygg för produktion
npm run build

# Förhandsgranska production build lokalt
npm run preview

# Kör alla tester
npm test

# Kör tester med UI
npm run test:ui

# Kör tester med coverage report
npm run test:coverage

# Generera PWA-ikoner
node scripts/generate-icons.js

# Lint kod
npm run lint
```

### **Projektstruktur**

```
portfolio-klas/
├── api/                          # Vercel serverless functions
│   ├── chat.js                   # OpenAI chatbot endpoint
│   └── verify-recaptcha.js       # reCAPTCHA verification
├── lib/                          # Shared libraries
│   ├── api/
│   │   └── client.js            # Axios instance med interceptors
│   ├── config/
│   │   ├── constants.js         # App-wide constants
│   │   └── env.js               # Environment variable validation
│   ├── utils/
│   │   ├── logger.js            # Structured logging
│   │   └── rateLimit.js         # IP-based rate limiting
│   └── validators/
│       └── inputValidator.js    # Input sanitization & validation
├── public/                       # Static assets
│   ├── pwa-*.png                # PWA icons (generated)
│   ├── apple-touch-icon.png     # iOS icon (generated)
│   ├── favicon.svg              # Favicon
│   ├── og-image.png             # Social media preview
│   └── CV_Klas_Olsson.pdf       # Downloadable CV
├── scripts/
│   └── generate-icons.js        # PWA icon generation script
├── src/
│   ├── assets/                  # Images, videos, fonts
│   ├── components/
│   │   ├── ChatUI.jsx           # AI chatbot interface
│   │   ├── DevTimeline.jsx      # Interactive timeline
│   │   ├── ErrorBoundary.jsx    # Error handling
│   │   ├── FloatingCode.jsx     # Animated code snippets
│   │   ├── GithubStats.jsx      # GitHub contributions
│   │   ├── HeroStage.jsx        # Main landing section
│   │   ├── HireMe.jsx           # Contact form
│   │   ├── InstallPrompt.jsx    # PWA install prompt
│   │   ├── NodeNetwork.jsx      # Three.js background
│   │   ├── ProfilePhoto.jsx     # Profile picture
│   │   ├── ProjectSlideshow.jsx # Project deep dives
│   │   └── data/
│   │       ├── projectSlides.jsx # Project slideshow data
│   │       └── translations.js   # Bilingual content
│   ├── App.jsx                  # Root component
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles
├── .env.example                 # Environment variables template
├── CLAUDE.md                    # Project documentation (sessions)
├── CODE_REVIEW.md               # Comprehensive code review
├── README.md                    # This file
├── package.json                 # Dependencies & scripts
├── tailwind.config.js           # Tailwind configuration
├── vite.config.js               # Vite + PWA configuration
└── vitest.config.js             # Test configuration
```

### **Development Workflow**

1. **Feature Development**
   - Skapa feature branch: `git checkout -b feature/feature-name`
   - Utveckla med `npm run dev`
   - Skriv tester för ny funktionalitet
   - Kör `npm test` före commit

2. **Code Quality**
   - Kör `npm run lint` för kod-linting
   - Kör `npm run test:coverage` för coverage report
   - Se till att coverage inte sjunker under 80%

3. **PWA Testing**
   - Testa service worker i dev mode
   - Verifiera offline-funktionalitet
   - Testa install prompt på mobil/desktop
   - Kör Lighthouse PWA audit

4. **Commit & Deploy**
   - Commit med beskrivande meddelande
   - Push till GitHub
   - Vercel deployer automatiskt
   - Verifiera i produktion

---

## 🧪 Testning

### **Test Coverage**

```
Overall Coverage: 84.12%
├── Statements:   84.12%
├── Branches:     75.38%
├── Functions:    67.64%
└── Lines:        85.34%
```

### **Test Suites**

#### **Component Tests** (`src/components/__tests__/`)
- **ChatUI.test.jsx** (12 tester)
  - Rendering (welcome messages, input, buttons)
  - Input validation (empty, valid)
  - Clear history functionality
  - Theme support (dark/light)
  - localStorage integration

#### **Validator Tests** (`lib/validators/__tests__/`)
- **inputValidator.test.js** (28 tester)
  - sanitizeTextInput (XSS protection, HTML removal)
  - Email validation & sanitization
  - Name validation (inkl. svenska tecken)
  - Budget validation & sanitization

### **Kör Tester**

```bash
# Alla tester
npm test

# Med UI (interactive)
npm run test:ui

# Med coverage report
npm run test:coverage

# Watch mode (auto re-run)
npm test -- --watch

# Specifik fil
npm test ChatUI.test.jsx
```

### **Test Setup**

- **Framework:** Vitest (Vite-native test runner)
- **Library:** React Testing Library
- **Matchers:** @testing-library/jest-dom
- **Coverage:** V8 provider
- **Environment:** jsdom (browser simulation)

---

## 🚢 Deployment

### **Vercel (Production)**

Projektet är konfigurerat för automatisk deployment via Vercel:

1. **Push till GitHub** → Vercel deployer automatiskt
2. **Environment Variables** sätts i Vercel Dashboard:
   - `OPENAI_API_KEY`
   - `RECAPTCHA_SECRET_KEY`
   - `VITE_RECAPTCHA_SITE_KEY`
3. **Custom Domain:** klasolsson.se med auto SSL

### **Build Configuration**

```json
{
  "buildCommand": "vite build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "nodeVersion": "18.x"
}
```

### **Deployment Checklist**

- ✅ Environment variables satta
- ✅ PWA-ikoner genererade
- ✅ All tester passerar
- ✅ Coverage över 80%
- ✅ Lighthouse score > 90
- ✅ Service worker registrerad
- ✅ reCAPTCHA konfigurerad

---

## 🔒 Säkerhet

### **Implementerade Säkerhetsåtgärder**

#### **Input Sanitization**
- XSS-skydd med HTML tag removal
- JavaScript protocol blocking
- Event handler stripping
- SQL injection prevention
- Max input length enforcement

#### **Rate Limiting**
- IP-based throttling (10 req/min)
- In-memory rate limit map
- X-RateLimit headers
- 429 status codes

#### **Bot Protection**
- reCAPTCHA v3 (score-based)
- Server-side token verification
- Configurable score threshold (0.5)
- Bilingual error messages

#### **API Security**
- OpenAI API key i environment variables
- Validering av alla inputs
- Error handling utan data leakage
- Timeout limits (15s)

#### **Environment Validation**
- Startup checks för required vars
- Type checking
- Clear error messages
- Fail-fast approach

### **Security Headers** (Vercel)

```json
{
  "headers": [
    {
      "key": "X-Frame-Options",
      "value": "DENY"
    },
    {
      "key": "X-Content-Type-Options",
      "value": "nosniff"
    },
    {
      "key": "Referrer-Policy",
      "value": "origin-when-cross-origin"
    }
  ]
}
```

---

## ⚡ Prestanda

### **Optimeringar**

#### **Bundle Optimization**
- Code splitting för routes
- Dynamic imports för tunga komponenter
- Tree shaking för unused kod
- Minification i production

#### **Asset Optimization**
- Lazy loading av bilder
- Responsive images (planned)
- WebP format (planned)
- Sharp-genererade ikoner

#### **Caching Strategies**
- Service worker precaching
- Google Fonts cache (1 år)
- GitHub API cache (1 timme)
- Static assets cache

#### **API Optimization**
- System prompt reduced 82% (340 → 60 rader)
- Structured logging (JSON)
- Error boundaries för partial failures
- Request timeouts

### **Core Web Vitals** (Lighthouse)

```
Performance:  95+  ⚡
Accessibility: 100  ♿
Best Practices: 100  ✅
SEO:          100  🔍
PWA:          100  📱
```

---

## ♿ Tillgänglighet

### **WCAG 2.1 Compliance**

#### **Keyboard Navigation**
- ✅ Full Tab-navigering
- ✅ Enter/Space för buttons
- ✅ Escape stänger modaler
- ✅ Focus indicators synliga
- ✅ Logical tab order

#### **Screen Reader Support**
- ✅ ARIA labels på alla interaktiva element
- ✅ role="dialog" för modaler
- ✅ aria-modal="true"
- ✅ aria-labelledby för titlar
- ✅ aria-expanded för expandables

#### **Visual Accessibility**
- ✅ Sufficient color contrast (4.5:1+)
- ✅ Focus indicators
- ✅ Text resizing support
- ✅ No motion for reduced-motion users (planned)

#### **Semantic HTML**
- ✅ Proper heading hierarchy
- ✅ Semantic landmarks
- ✅ Alt text på alla bilder
- ✅ Form labels korrekt associerade

### **Accessibility Testing**

```bash
# Lighthouse accessibility audit
npm run build && npm run preview
# Öppna DevTools → Lighthouse → Accessibility

# Manual testing
# - Tab genom alla interaktiva element
# - Testa med screen reader (NVDA/JAWS/VoiceOver)
# - Testa med endast tangentbord
```

---

## 📊 Projektstatistik

### **Kodstatistik**

```
Total filer:          ~50+
Rader kod:           ~3,500+ (exkl. node_modules)
React komponenter:   15+
API endpoints:       2
Test suites:         2
Total tester:        40+
Test coverage:       84%
```

### **Dependencies**

```
Production:          24 packages
Development:         35 packages
Total:              59 packages
```

### **Performance Metrics**

```
Build time:          ~10-15s
Bundle size:         ~450 KB (gzipped)
Lighthouse score:    95+
First Paint:         <1s
Time to Interactive: <2s
```

### **Completed Features**

```
✅ All CODE_REVIEW.md Issues Complete (100%)
├── GDPR Cookie Consent & Privacy ✅
├── PWA Full Implementation ✅
├── Accessibility (WCAG) ✅
├── Test Coverage (84%) ✅
└── Security Hardening ✅
```

---

## 📄 Licens

**Privat/Proprietary** - Detta projekt är privat källkod för Klas Olsson's personliga portfolio.

### **Användning**

- ✅ Titta på och lära från koden
- ✅ Forka för personligt lärande
- ❌ Inte för kommersiell användning
- ❌ Inte för återdistribution
- ❌ Inte för att kopiera design

---

## 👤 Kontakt & Support

**Klas Olsson** - .NET System Developer

- 🌐 Portfolio: [klasolsson.se](https://klasolsson.se)
- 📧 Email: klasolsson81@gmail.com
- 💼 LinkedIn: [linkedin.com/in/klasolsson81](https://www.linkedin.com/in/klasolsson81/)
- 🐙 GitHub: [@klasolsson81](https://github.com/klasolsson81)

---

## 🙏 Acknowledgments

- **OpenAI** - GPT-4o API för chatbot
- **Vercel** - Hosting och analytics
- **Three.js Community** - 3D graphics inspiration
- **React Community** - Framework och ekosystem
- **Claude Code** - Development assistance och code review

---

<div align="center">

**⭐ Om du gillar detta projekt, ge det en stjärna på GitHub! ⭐**

**🎉 100% Complete - Enterprise-Grade Portfolio PWA 🎉**

[![Made with React](https://img.shields.io/badge/Made%20with-React-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Powered by Vercel](https://img.shields.io/badge/Powered%20by-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

</div>
