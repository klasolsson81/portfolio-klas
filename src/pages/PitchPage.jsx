import { useState, useEffect, useRef, useCallback } from "react";

/*───────────────────────────────────────────────────────────
  PITCH PAGE – Klas Olsson → Infinet Code AB
  Fullstack Developer Application
───────────────────────────────────────────────────────────*/

const PHOTO_BASE64 = "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";

function useCountUp(target, duration = 2000, startDelay = 0) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);
  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(interval); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(interval);
  }, [started, target, duration]);
  return count;
}

function Particles() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const particles = [];
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const handleMouse = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", handleMouse);
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 0.5, o: Math.random() * 0.4 + 0.1,
        baseR: Math.random() * 2 + 0.5,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      particles.forEach((p) => {
        // Mouse repulsion
        const dmx = p.x - mx;
        const dmy = p.y - my;
        const mDist = Math.sqrt(dmx * dmx + dmy * dmy);
        if (mDist < 150 && mDist > 0) {
          const force = (150 - mDist) / 150 * 0.8;
          p.vx += (dmx / mDist) * force;
          p.vy += (dmy / mDist) * force;
          p.r = p.baseR + (150 - mDist) / 150 * 2;
        } else {
          p.r += (p.baseR - p.r) * 0.05;
        }
        p.vx *= 0.98; p.vy *= 0.98;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const glow = mDist < 150 ? Math.min(p.o + 0.3, 0.8) : p.o;
        ctx.fillStyle = `rgba(59,130,246,${glow})`; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59,130,246,${0.1 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", handleMouse); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

/* ─── Mouse Spotlight ─── */
function MouseSpotlight() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e) => { el.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(59,130,246,0.06), transparent 60%)`; };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div ref={ref} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 5, transition: "background 0.15s" }} />;
}

/* ─── Scroll Reveal ─── */
function RevealOnScroll({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setTimeout(() => setVisible(true), delay); obs.unobserve(el); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.97)",
      transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
    }}>
      {children}
    </div>
  );
}

/* ─── Tilt Card ─── */
function TiltCard({ children, style = {} }) {
  const ref = useRef(null);
  const handleMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;
  }, []);
  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
  }, []);
  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{ transition: "transform 0.2s ease-out", willChange: "transform", ...style }}>
      {children}
    </div>
  );
}

/* ─── SVG Icons ─── */
const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);
const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
);
const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const ExternalIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
);

function GlassCard({ children, delay = 0, glowColor = "59,130,246", style = {}, animated = false }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      background: animated
        ? "linear-gradient(135deg, rgba(15,23,42,0.8), rgba(15,23,42,0.6))"
        : "rgba(15,23,42,0.6)",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      border: `1px solid rgba(${glowColor},0.15)`,
      borderRadius: 16, padding: "24px",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)",
      transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
      position: "relative", overflow: "hidden",
      ...style,
    }}>
      {/* Top glow accent */}
      <div style={{
        position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
        background: `linear-gradient(90deg, transparent, rgba(${glowColor},0.6), transparent)`,
      }} />
      {/* Bottom glow accent */}
      <div style={{
        position: "absolute", bottom: 0, left: "20%", right: "20%", height: 1,
        background: `linear-gradient(90deg, transparent, rgba(${glowColor},0.2), transparent)`,
      }} />
      {children}
    </div>
  );
}

export default function PitchPage() {
  const [loaded, setLoaded] = useState(false);
  const [titleDone, setTitleDone] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullTitle = "Pick Me.";

  useEffect(() => {
    const originalTitle = document.title;
    document.title = "Klas Olsson \u2014 Fullstack Developer | Infinet Code AB";
    // Override index.css overflow:hidden on html/body (desktop)
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = "auto";
    body.style.overflow = "auto";
    return () => {
      document.title = originalTitle;
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  useEffect(() => { setTimeout(() => setLoaded(true), 200); }, []);

  // Typing effect
  useEffect(() => {
    if (!loaded) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedText(fullTitle.slice(0, i));
      if (i >= fullTitle.length) { clearInterval(interval); setTimeout(() => setTitleDone(true), 300); }
    }, 120);
    return () => clearInterval(interval);
  }, [loaded]);

  const views = useCountUp(60000, 2000, 1500);
  const users = useCountUp(50, 1500, 1700);
  const years = useCountUp(22, 1500, 1900);

  const techStack = ["React", "TypeScript", ".NET / C#", "Supabase", "OpenAI API", "Vercel", "GitHub CI/CD", "TailwindCSS"];

  const projects = [
    { name: "KalasKoll", desc: "Viral app för barnkalas-inbjudningar. 60 000+ LinkedIn-visningar, 50+ aktiva användare. Från idé till deploy — solo.", color: "59,130,246", link: "https://kalaskoll.se", github: "https://github.com/klasolsson81/kalaskoll" },
    { name: "Yobber V2", desc: "Rekryteringsplattform åt Devotion Ventures. OAuth, AI-matchning via OpenAI, Kanban-pipeline, e-postinfrastruktur. Ensam utvecklare.", color: "139,92,246", link: "https://www.yobber.website/", github: null },
    { name: "klasolsson.se", desc: "AI-driven portfoliosida med integrerad chatt och projektanalys. Min digitala bas.", color: "6,182,212", link: "https://klasolsson.se", github: "https://github.com/klasolsson81/portfolio-klas" },
  ];

  const socials = [
    { icon: <LinkedInIcon />, label: "LinkedIn", href: "https://www.linkedin.com/in/klasolsson81/", color: "#0a66c2" },
    { icon: <GitHubIcon />, label: "GitHub", href: "https://github.com/klasolsson81", color: "#8b949e" },
    { icon: <MailIcon />, label: "E-post", href: "mailto:klasolsson81@gmail.com", color: "#10b981" },
  ];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');

    @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
    @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); } 70% { box-shadow: 0 0 0 15px rgba(59,130,246,0); } 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); } }
    @keyframes gradient-x { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
    @keyframes blink { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes scan { 0% { top: -2px; } 100% { top: 100%; } }
    @keyframes spin-border { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    @keyframes aurora-1 { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(30px,-50px) scale(1.1); } 66% { transform: translate(-20px,20px) scale(0.9); } }
    @keyframes aurora-2 { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(-40px,30px) scale(1.2); } 66% { transform: translate(50px,-30px) scale(0.85); } }
    @keyframes glow-pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
    @keyframes badge-in { from { opacity: 0; transform: translateY(10px) scale(0.8); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes text-glow { 0%,100% { text-shadow: 0 0 20px rgba(59,130,246,0.3); } 50% { text-shadow: 0 0 40px rgba(59,130,246,0.6), 0 0 80px rgba(6,182,212,0.2); } }

    .pitch-tech-badge { animation: badge-in 0.5s ease both; }
    .pitch-tech-badge:hover { transform: translateY(-3px) scale(1.05) !important; box-shadow: 0 8px 25px rgba(59,130,246,0.3) !important; border-color: rgba(59,130,246,0.5) !important; }
    .pitch-glass-card:hover { border-color: rgba(59,130,246,0.35) !important; box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 40px rgba(59,130,246,0.1) !important; }
    .pitch-social-link { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important; }
    .pitch-social-link:hover { transform: translateY(-6px) scale(1.1) !important; }
    .pitch-project-link { transition: all 0.25s ease !important; }
    .pitch-project-link:hover { background: rgba(255,255,255,0.08) !important; transform: translateX(2px) !important; }

    * { box-sizing: border-box; margin: 0; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #0a0e17; }
    ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 3px; }

    .pitch-title { font-size: 60px; }
    .pitch-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
    .pitch-stat-value { font-size: 24px; }
    .pitch-header-subtitle { font-size: 11px; letter-spacing: 8px; }

    @media (max-width: 640px) {
      .pitch-title { font-size: 36px !important; }
      .pitch-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
      .pitch-stat-value { font-size: 18px !important; }
      .pitch-header-subtitle { font-size: 9px !important; letter-spacing: 4px !important; }
      .pitch-photo-wrapper { width: 120px !important; height: 120px !important; }
      .pitch-photo-img { width: 110px !important; height: 110px !important; }
      .pitch-tech-badge { padding: 6px 12px !important; font-size: 12px !important; }
      .pitch-social-link { padding: 8px 14px !important; font-size: 13px !important; }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div style={{
        minHeight: "100vh", position: "relative", overflowX: "hidden",
        background: "linear-gradient(160deg, #020617 0%, #0a1628 30%, #0f172a 60%, #0c1322 100%)",
        fontFamily: "'Inter', system-ui, sans-serif", color: "#e2e8f0",
      }}>
        <Particles />
        <MouseSpotlight />

        {/* Aurora blobs */}
        <div style={{
          position: "fixed", top: "10%", left: "-10%", width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.08), transparent 70%)",
          animation: "aurora-1 15s ease-in-out infinite", pointerEvents: "none", zIndex: 1,
        }} />
        <div style={{
          position: "fixed", bottom: "5%", right: "-10%", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)",
          animation: "aurora-2 18s ease-in-out infinite", pointerEvents: "none", zIndex: 1,
        }} />
        <div style={{
          position: "fixed", top: "50%", left: "50%", width: 400, height: 400, borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(6,182,212,0.04), transparent 70%)",
          animation: "aurora-1 20s ease-in-out infinite reverse", pointerEvents: "none", zIndex: 1,
        }} />

        {/* Scan line effect */}
        <div style={{
          position: "fixed", left: 0, right: 0, height: 2, opacity: 0.03,
          background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
          animation: "scan 8s linear infinite", pointerEvents: "none", zIndex: 50,
        }} />

        {/* Noise overlay */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2, opacity: 0.015,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: 800, margin: "0 auto", padding: "40px 20px 60px" }}>

          {/* ─── HEADER ─── */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="pitch-header-subtitle" style={{
              color: "rgba(59,130,246,0.6)",
              fontWeight: 600, marginBottom: 28,
              opacity: loaded ? 1 : 0, transition: "opacity 1s ease 0.3s",
            }}>
              FULLSTACK DEVELOPER &nbsp;•&nbsp; ANSÖKAN
            </div>

            {/* Photo with spinning border */}
            <div className="pitch-photo-wrapper" style={{
              width: 160, height: 160, borderRadius: "50%", margin: "0 auto 28px",
              position: "relative", animation: loaded ? "float 6s ease-in-out infinite" : "none",
              opacity: loaded ? 1 : 0, transform: loaded ? "scale(1)" : "scale(0.5)",
              transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s",
            }}>
              {/* Spinning gradient ring */}
              <div style={{
                position: "absolute", inset: -5, borderRadius: "50%",
                background: "conic-gradient(from 0deg, #3b82f6, #06b6d4, #8b5cf6, #ec4899, #3b82f6)",
                animation: "spin-border 4s linear infinite",
              }} />
              {/* Glow behind photo */}
              <div style={{
                position: "absolute", inset: -15, borderRadius: "50%",
                background: "conic-gradient(from 180deg, #3b82f6, #06b6d4, #8b5cf6, #ec4899, #3b82f6)",
                filter: "blur(30px)", opacity: 0.35,
                animation: "glow-pulse 4s ease-in-out infinite",
              }} />
              <img className="pitch-photo-img" src={`data:image/jpeg;base64,${PHOTO_BASE64}`} alt="Klas Olsson"
                style={{
                  width: 150, height: 150, borderRadius: "50%", objectFit: "cover",
                  position: "relative", zIndex: 2, border: "4px solid #0f172a",
                  top: 5, left: 5,
                }}
              />
            </div>

            {/* Typed title */}
            <h1 className="pitch-title" style={{
              fontWeight: 900, margin: "0 0 4px", letterSpacing: -2,
              fontFamily: "'Inter', sans-serif", lineHeight: 1.1,
              animation: titleDone ? "text-glow 3s ease-in-out infinite" : "none",
            }}>
              <span style={{
                background: "linear-gradient(135deg, #fff 0%, #60a5fa 40%, #06b6d4 70%, #8b5cf6 100%)",
                backgroundSize: "300% 300%", animation: titleDone ? "gradient-x 4s ease infinite" : "none",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                {typedText}
              </span>
              {!titleDone && (
                <span style={{
                  display: "inline-block", width: 3, height: 52, marginLeft: 4,
                  background: "#3b82f6", verticalAlign: "middle",
                  animation: "blink 1s step-end infinite",
                }} />
              )}
            </h1>

            <div style={{
              fontSize: 20, fontWeight: 300, color: "#94a3b8", marginBottom: 8,
              opacity: titleDone ? 1 : 0, transition: "opacity 0.6s ease",
            }}>
              Klas Olsson
            </div>
            <div style={{
              fontSize: 13, color: "#475569",
              opacity: titleDone ? 1 : 0, transition: "opacity 0.6s ease 0.2s",
            }}>
              .NET Systemutvecklare &nbsp;|&nbsp;{" "}
              <a href="https://klasolsson.se" target="_blank" rel="noopener noreferrer"
                style={{ color: "#3b82f6", textDecoration: "none", borderBottom: "1px solid rgba(59,130,246,0.3)" }}>
                klasolsson.se
              </a>
            </div>

            {/* Social links under header */}
            <div style={{
              display: "flex", justifyContent: "center", gap: 16, marginTop: 18,
              opacity: titleDone ? 1 : 0, transition: "opacity 0.6s ease 0.4s",
            }}>
              {socials.map((s, i) => (
                <a key={i} href={s.href} target={s.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer"
                  className="pitch-social-link"
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    color: s.color, textDecoration: "none", fontSize: 12, fontWeight: 500,
                    padding: "6px 14px", borderRadius: 8,
                    background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.08)`,
                  }}>
                  {s.icon}
                  <span>{s.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* ─── ZERO COST BANNER ─── */}
          <RevealOnScroll>
            <TiltCard>
              <GlassCard delay={900} glowColor="16,185,129" animated style={{ marginBottom: 20, textAlign: "center", borderColor: "rgba(16,185,129,0.25)" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>💰</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#10b981", marginBottom: 10, letterSpacing: -0.5 }}>
                  Ingen lönekostnad
                </div>
                <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, maxWidth: 500, margin: "0 auto" }}>
                  Mitt omställningsstöd täcker mig ekonomiskt. Du får en fullstack-utvecklare som levererar
                  — <span style={{ color: "#e2e8f0", fontWeight: 600 }}>utan att det kostar dig en krona i lön</span>.
                </div>
              </GlassCard>
            </TiltCard>
          </RevealOnScroll>

          {/* ─── STATS ─── */}
          <div className="pitch-stats-grid">
            {[
              { value: views.toLocaleString("sv-SE") + "+", label: "LinkedIn-visningar", icon: "👁" },
              { value: users + "+", label: "Aktiva användare", icon: "👥" },
              { value: years + " år", label: "Yrkeserfarenhet", icon: "💼" },
              { value: "0 kr", label: "Lönekostnad", icon: "✅" },
            ].map((s, i) => (
              <RevealOnScroll key={i} delay={i * 100}>
                <TiltCard>
                  <GlassCard delay={1100 + i * 150} style={{ textAlign: "center", padding: "20px 12px" }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                    <div className="pitch-stat-value" style={{
                      fontWeight: 800, fontFamily: "'JetBrains Mono', monospace",
                      background: "linear-gradient(135deg, #60a5fa, #06b6d4)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: "#64748b", marginTop: 4, letterSpacing: 0.5 }}>{s.label}</div>
                  </GlassCard>
                </TiltCard>
              </RevealOnScroll>
            ))}
          </div>

          {/* ─── CORE MESSAGE ─── */}
          <RevealOnScroll>
            <GlassCard delay={1700} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#3b82f6", letterSpacing: 4, marginBottom: 14, textTransform: "uppercase" }}>
                🚀 Jag levererar
              </div>
              <div style={{ fontSize: 15, color: "#cbd5e1", lineHeight: 1.8 }}>
                Jag bygger inte skolprojekt — jag bygger{" "}
                <span style={{ color: "#fff", fontWeight: 700 }}>riktiga produkter med riktiga användare</span>.
                Från idé till deploy, fullstack, hela kedjan. React + TypeScript i frontend, .NET/C# och Supabase i backend, AI-integration via OpenAI.
              </div>
            </GlassCard>
          </RevealOnScroll>

          {/* ─── PROJECTS ─── */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#3b82f6", letterSpacing: 4, marginBottom: 14, textTransform: "uppercase", paddingLeft: 4 }}>
              📦 Projekt i produktion
            </div>
            {projects.map((p, i) => (
              <RevealOnScroll key={i} delay={i * 120}>
                <TiltCard style={{ marginBottom: 12 }}>
                  <GlassCard delay={1900 + i * 200} glowColor={p.color} style={{ borderLeft: `3px solid rgba(${p.color},0.5)` }}>
                    <div className="pitch-glass-card" style={{ cursor: "default", transition: "all 0.3s ease" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 17, fontWeight: 800, color: "#e2e8f0" }}>{p.name}</span>
                        <div style={{ display: "flex", gap: 6 }}>
                          {p.link && (
                            <a href={p.link} target="_blank" rel="noopener noreferrer" className="pitch-project-link"
                              style={{
                                fontSize: 11, color: `rgb(${p.color})`, textDecoration: "none",
                                border: `1px solid rgba(${p.color},0.3)`, borderRadius: 6,
                                padding: "3px 10px", display: "inline-flex", alignItems: "center", gap: 4,
                              }}>
                              Live demo <ExternalIcon />
                            </a>
                          )}
                          {p.github && (
                            <a href={p.github} target="_blank" rel="noopener noreferrer" className="pitch-project-link"
                              style={{
                                fontSize: 11, color: "#8b949e", textDecoration: "none",
                                border: "1px solid rgba(139,148,158,0.25)", borderRadius: 6,
                                padding: "3px 10px", display: "inline-flex", alignItems: "center", gap: 4,
                              }}>
                              Kod <ExternalIcon />
                            </a>
                          )}
                        </div>
                      </div>
                      <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>{p.desc}</div>
                    </div>
                  </GlassCard>
                </TiltCard>
              </RevealOnScroll>
            ))}
          </div>

          {/* ─── TECH STACK ─── */}
          <RevealOnScroll>
            <GlassCard delay={2500} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#3b82f6", letterSpacing: 4, marginBottom: 16, textTransform: "uppercase" }}>
                🛠 Tech Stack
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {techStack.map((t, i) => (
                  <span key={i} className="pitch-tech-badge" style={{
                    background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(6,182,212,0.08))",
                    border: "1px solid rgba(59,130,246,0.2)", borderRadius: 8,
                    padding: "8px 16px", fontSize: 13, fontWeight: 600, color: "#93c5fd",
                    fontFamily: "'JetBrains Mono', monospace",
                    transition: "all 0.3s ease", cursor: "default",
                    animationDelay: `${i * 0.08}s`,
                  }}>{t}</span>
                ))}
              </div>
            </GlassCard>
          </RevealOnScroll>

          {/* ─── CLAUDE MAX GIFT ─── */}
          <RevealOnScroll>
            <TiltCard>
              <GlassCard delay={2700} glowColor="139,92,246" animated style={{ marginBottom: 20, borderColor: "rgba(139,92,246,0.25)" }}>
                <div style={{ fontSize: 32, marginBottom: 10, textAlign: "center" }}>🤖</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#a78bfa", marginBottom: 10, textAlign: "center" }}>
                  Claude Max som Gift — min enda önskan
                </div>
                <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
                  Istället för lön: en{" "}
                  <a href="https://claude.ai/upgrade" target="_blank" rel="noopener noreferrer"
                    style={{ color: "#a78bfa", textDecoration: "none", borderBottom: "1px solid rgba(139,92,246,0.4)", fontWeight: 600 }}>
                    gift-prenumeration på Claude Max
                  </a>{" "}
                  ($100/mån). Det AI-verktyg jag använder dagligen för att leverera snabbare, stabilare och mer genomarbetad kod.
                  <span style={{ display: "block", marginTop: 10, color: "#cbd5e1", fontWeight: 600, fontSize: 15 }}>
                    3 månader = ca 3 200 kr. Din totala investering.
                  </span>
                </div>
              </GlassCard>
            </TiltCard>
          </RevealOnScroll>

          {/* ─── HEADS UP ─── */}
          <RevealOnScroll>
            <GlassCard delay={2900} glowColor="234,179,8" style={{ marginBottom: 20, borderColor: "rgba(234,179,8,0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>⏳</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#eab308" }}>Heads up</span>
              </div>
              <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7 }}>
                Behöver avsluta samarbetet med Devotion Ventures på ett snyggt och professionellt sätt — ca 2–3 veckor. Sedan <span style={{ color: "#e2e8f0", fontWeight: 600 }}>100% tillgänglig</span>.
              </div>
            </GlassCard>
          </RevealOnScroll>

          {/* ─── CONTACT / CTA ─── */}
          <RevealOnScroll>
            <div style={{
              marginBottom: 40, padding: "32px 24px", borderRadius: 16, textAlign: "center",
              background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.06))",
              border: "1px solid rgba(59,130,246,0.15)",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#3b82f6", letterSpacing: 4, marginBottom: 16, textTransform: "uppercase" }}>
                📬 Kontakt
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", marginBottom: 16 }}>
                {socials.map((s, i) => (
                  <a key={i} href={s.href} target={s.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer"
                    className="pitch-social-link"
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      color: s.color, textDecoration: "none", fontSize: 14, fontWeight: 600,
                      padding: "10px 20px", borderRadius: 10,
                      background: "rgba(15,23,42,0.6)", border: `1px solid rgba(255,255,255,0.08)`,
                      backdropFilter: "blur(8px)",
                    }}>
                    {s.icon}
                    <span>{s.label}</span>
                  </a>
                ))}
              </div>
              <div style={{ fontSize: 13, color: "#64748b" }}>
                klasolsson81@gmail.com &nbsp;|&nbsp;{" "}
                <a href="https://klasolsson.se" target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", textDecoration: "none" }}>klasolsson.se</a>
              </div>
            </div>
          </RevealOnScroll>

          {/* ─── FOOTER ─── */}
          <div style={{
            textAlign: "center", fontSize: 11, letterSpacing: 1, color: "#334155",
            borderTop: "1px solid rgba(59,130,246,0.08)", paddingTop: 24,
          }}>
            Klas Olsson &nbsp;•&nbsp;{" "}
            <a href="https://klasolsson.se" target="_blank" rel="noopener noreferrer" style={{ color: "#475569", textDecoration: "none" }}>klasolsson.se</a>
            &nbsp;•&nbsp;{" "}
            <a href="https://www.linkedin.com/in/klasolsson81/" target="_blank" rel="noopener noreferrer" style={{ color: "#475569", textDecoration: "none" }}>LinkedIn</a>
            &nbsp;•&nbsp;{" "}
            <a href="https://github.com/klasolsson81" target="_blank" rel="noopener noreferrer" style={{ color: "#475569", textDecoration: "none" }}>GitHub</a>
            &nbsp;•&nbsp; Infinet Code AB
          </div>
        </div>
      </div>
    </>
  );
}
