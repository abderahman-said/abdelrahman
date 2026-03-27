"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: "01",
    name: "WAPilot",
    category: "SaaS Platform",
    skills: ["React 19"],
    accent: "#e8ff47",
    image: "/assets/projects/WAPilot.png",
    link: "https://app.wapilot.net"
  },
  {
    id: "02",
    name: "Rasayl",
    category: "Multi-Role Platform",
    skills: ["Next.js"],
    accent: "#c084fc",
    image: "/assets/projects/rasayel.png",
    link: "https://rasayl.nodejs.puiux.org/ar"
  },
  {
    id: "03",
    name: "SKYS",
    category: "Hotel Booking",
    skills: ["Next.js"],
    accent: "#2dd4bf",
    image: "/assets/projects/skys.png",
    link: "https://skys-front-puiux.vercel.app/en"
  },
  {
    id: "04",
    name: "Nawan",
    category: "E-Commerce",
    skills: ["Next.js"],
    accent: "#34d399",
    image: "/assets/projects/nawan.png",
    link: "https://nawan.co/ar"
  },
  {
    id: "05",
    name: "Arkit",
    category: "Architecture Docs",
    skills: ["Next.js"],
    accent: "#fb923c",
    image: "/assets/projects/arkit.png",
    link: "https://arkit-three.vercel.app/ar"
  },
  {
    id: "06",
    name: "Faturti",
    category: "Invoicing SAAS",
    skills: ["React.js"],
    accent: "#60a5fa",
    image: "/assets/projects/faturti.png",
    link: "https://faturti-mhr.com/login"
  },
  {
    id: "07",
    name: "Al-Milhem",
    category: "Portfolio",
    skills: ["Next.js"],
    accent: "#8b5cf6",
    image: "/assets/projects/almlhem.png",
    link: "https://nodejs2.al-milhem-frontend.nodejs2.nodejs2.puiux.org/ar"
  },
  {
    id: "08",
    name: "Aqar Corp",
    category: "Real Estate",
    skills: ["Next.js"],
    accent: "#f59e0b",
    image: "/assets/projects/aqar.png",
    link: "https://aqarcorp.com"
  }
];

function setTheme(el, dark) {
  if (dark) {
    el.style.setProperty("--pt-bg",          "#0c0c0c");
    el.style.setProperty("--pt-surface",     "#141414");
    el.style.setProperty("--pt-text",        "#f0ece4");
    el.style.setProperty("--pt-muted",       "#5a5a5a");
    el.style.setProperty("--pt-border",      "rgba(255,255,255,0.08)");
    el.style.setProperty("--pt-border-card", "rgba(255,255,255,0.07)");
  } else {
    el.style.setProperty("--pt-bg",          "#f0ebe6");
    el.style.setProperty("--pt-surface",     "#e8e2dc");
    el.style.setProperty("--pt-text",        "#1a1714");
    el.style.setProperty("--pt-muted",       "#9a9088");
    el.style.setProperty("--pt-border",      "rgba(0,0,0,0.1)");
    el.style.setProperty("--pt-border-card", "rgba(0,0,0,0.08)");
  }
}

export default function ProjectsSection() {
  const pinContainerRef = useRef(null);
  const viewportRef     = useRef(null);
  const trackRef        = useRef(null);
  const progressRef     = useRef(null);
  const labelRef        = useRef(null);
  const contentRef      = useRef(null);
  const introRef        = useRef(null);

  useEffect(() => {
    const track     = trackRef.current;
    const viewport  = viewportRef.current;
    const container = pinContainerRef.current;
    const content   = contentRef.current;
    const intro     = introRef.current;

    const isDesktop   = () => window.innerWidth > 1024;
    const getDistance = () => track.scrollWidth - viewport.offsetWidth;

    // ── Phase boundaries (0 → 1) ─────────────────────────────────────
    // 0.00 → 0.08 : intro text visible, nothing else
    // 0.08 → 0.20 : intro zooms out + fades, circle starts growing
    // 0.20 → 0.32 : circle completes, theme flips to dark
    // 0.32 → 1.00 : content fades in, horizontal scroll runs
    const ZOOM_START  = 0.08;
    const CIRCLE_PEAK = 0.32;
    const REVEAL_AT   = 0.34;

    // ── Initial states ────────────────────────────────────────────────
    setTheme(container, false);
    gsap.set(content, { opacity: 0, y: 24 });
    gsap.set(intro,   { opacity: 1, scale: 1, transformOrigin: "center center" });

    // ── Dark overlay ──────────────────────────────────────────────────
    const overlay = document.createElement("div");
    overlay.style.cssText = [
      "position:absolute", "inset:0",
      "background:#0c0c0c", "pointer-events:none",
      "z-index:0",
      "clip-path:circle(0% at 50% 50%)",
      "will-change:clip-path",
    ].join(";");

    container.style.position = "relative";
    container.style.overflow = "hidden";
    container.insertBefore(overlay, container.firstChild);

    Array.from(container.children).forEach((child) => {
      if (child !== overlay) {
        child.style.position = "relative";
        child.style.zIndex   = "1";
      }
    });

    // ── Horizontal anim (paused, driven manually) ─────────────────────
    const horizAnim = isDesktop()
      ? gsap.to(track, { x: () => -getDistance(), ease: "none", paused: true })
      : null;

    let flippedToDark  = false;
    let hasRevealed    = false;
    let introHidden    = false;

    // ── Master trigger ────────────────────────────────────────────────
    const getScrollLength = () => {
      const horizDist = isDesktop() ? getDistance() : window.innerHeight * 2;
      return horizDist / (1 - REVEAL_AT) + window.innerHeight * 0.6;
    };

    const masterST = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: () => `+=${getScrollLength()}`,
      scrub: 1,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,

      onUpdate(self) {
        const p = self.progress;

        // ── Intro: zoom-out + fade (ZOOM_START → CIRCLE_PEAK) ────────
        if (p >= ZOOM_START) {
          const zp      = Math.min((p - ZOOM_START) / (CIRCLE_PEAK - ZOOM_START), 1);
          const eased   = zp * zp;                   // ease-in-quad: slow start, fast exit
          const scale   = 1 + eased * 3.2;           // zoom from 1× → 4.2×
          const opacity = 1 - eased;
          gsap.set(intro, { scale, opacity });

          if (!introHidden && zp >= 1) introHidden = true;
          if (introHidden && zp < 1)  introHidden = false;
        } else {
          gsap.set(intro, { scale: 1, opacity: 1 });
          introHidden = false;
        }

        // ── Circle expand (ZOOM_START → CIRCLE_PEAK) ─────────────────
        if (p >= ZOOM_START) {
          const cp     = Math.min((p - ZOOM_START) / (CIRCLE_PEAK - ZOOM_START), 1);
          const eased  = cp * (2 - cp);              // ease-out-quad
          const radius = eased * 150;
          overlay.style.clipPath = `circle(${radius.toFixed(2)}% at 50% 50%)`;
        } else {
          overlay.style.clipPath = "circle(0% at 50% 50%)";
        }

        // ── Theme flip ────────────────────────────────────────────────
        const themeThreshold = ZOOM_START + (CIRCLE_PEAK - ZOOM_START) * 0.75;
        if (p >= themeThreshold && !flippedToDark) {
          flippedToDark = true;
          setTheme(container, true);
        } else if (p < themeThreshold && flippedToDark) {
          flippedToDark = false;
          setTheme(container, false);
        }

        // ── Content reveal (REVEAL_AT →) ──────────────────────────────
        if (p >= REVEAL_AT && !hasRevealed) {
          hasRevealed = true;
          gsap.to(content, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
        } else if (p < REVEAL_AT * 0.95 && hasRevealed) {
          hasRevealed = false;
          gsap.to(content, { opacity: 0, y: 24, duration: 0.35, ease: "power2.in" });
        }

        // ── Horizontal scroll (REVEAL_AT → 1) ────────────────────────
        if (p >= REVEAL_AT && isDesktop() && horizAnim) {
          const hp = Math.max(0, Math.min(1, (p - REVEAL_AT) / (1 - REVEAL_AT)));
          horizAnim.progress(hp);

          if (progressRef.current) progressRef.current.style.width = `${hp * 100}%`;
          if (labelRef.current) {
            const idx = Math.min(projects.length - 1, Math.floor(hp * projects.length));
            labelRef.current.textContent =
              `${String(idx + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;
          }
        }
      },
    });

    // ── Image parallax ────────────────────────────────────────────────
    if (isDesktop()) {
      gsap.utils.toArray(".card-img").forEach((img) => {
        gsap.fromTo(img, { xPercent: -7 }, {
          xPercent: 7, ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${getScrollLength()}`,
            scrub: 2.5, invalidateOnRefresh: true,
          },
        });
      });
    }

    return () => {
      masterST.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <>
      <style>{`
        .pin-container {
          --pt-bg:          #f0ebe6;
          --pt-surface:     #e8e2dc;
          --pt-text:        #1a1714;
          --pt-muted:       #9a9088;
          --pt-border:      rgba(0,0,0,0.1);
          --pt-border-card: rgba(0,0,0,0.08);
          background: var(--pt-bg);
          width: 100%;
          min-height: 100vh;
          transition: background 0.06s linear;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* ── Intro text ── */
        .proj-intro {
          position: absolute;
          inset: 0;
          top: 42%;
           display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 16px;
          pointer-events: none;
          z-index: 2;
          will-change: transform, opacity;
          transform-origin: center center;
          text-align: center;
        }
        .proj-intro-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--pt-text);
        }
        .proj-intro-text {
          font-size: clamp(32px, 5.5vw, 80px);
          font-weight: 800;
          color: var(--pt-text);
          letter-spacing: -0.04em;
          line-height: 1;
          text-align: center;
          margin: 0;
        }
        .proj-intro-text em {
          font-style: italic;
          font-weight: 400;
          color: transparent;
          -webkit-text-stroke: 1.5px var(--pt-text);
        }

        /* ── Main content ── */
        .proj-content-wrapper { will-change: transform, opacity; }

        .proj-header {
          padding: 100px 72px 48px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
        }
        .proj-heading {
          font-size: clamp(40px, 7vw, 112px);
          font-weight: 800;
          color: var(--pt-text);
          line-height: 0.92;
          letter-spacing: -0.04em;
          margin: 0;
          transition: color 0.4s ease;
        }
        .proj-heading em {
          font-style: italic;
          font-weight: 400;
          color: transparent;
          -webkit-text-stroke: 1.5px var(--pt-text);
          transition: -webkit-text-stroke-color 0.4s ease;
        }
        .proj-meta {
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 8px; padding-bottom: 8px;
        }
        .proj-count {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.18em;
          color: var(--pt-muted); text-transform: uppercase;
        }
        .proj-hint {
          font-family: 'DM Mono', monospace;
          font-size: 11px; color: var(--pt-muted);
          display: flex; align-items: center; gap: 8px;
          letter-spacing: 0.08em;
        }
        .proj-hint::before {
          content:''; width:28px; height:1px;
          background: var(--pt-muted); display:inline-block;
        }

        .scroll-progress-wrap {
          padding: 0 72px 36px;
          display: flex; align-items: center; gap: 16px;
        }
        .scroll-progress-bar {
          flex: 1; height: 1px;
          background: var(--pt-border); border-radius: 2px; overflow: hidden;
        }
        .scroll-progress-fill {
          height: 100%; width: 0%;
          background: var(--pt-text);
          transition: width 0.08s linear;
        }
        .scroll-progress-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.12em; color: var(--pt-muted);
          min-width: 48px; text-align: right;
        }

        .proj-viewport { overflow: hidden; padding: 0 72px 80px; }
        .proj-track {
          display: flex; gap: 24px;
          width: max-content; will-change: transform;
          align-items: flex-start;
        }

        .proj-card {
          width: clamp(300px, 26vw, 420px);
          border-radius: 16px; overflow: hidden;
          background: var(--pt-surface);
          border: 1px solid var(--pt-border-card);
          cursor: pointer; flex-shrink: 0; position: relative;
          transition: border-color 0.3s, background 0.4s ease;
        }
        .proj-card:hover { border-color: var(--pt-muted); }
        .proj-card:nth-child(even) { margin-top: 52px; }

        .card-img-wrap { width: 100%; aspect-ratio: 4/3; overflow: hidden; position: relative; }
        .card-img {
          width: 114%; height: 250px; object-fit: cover;
          margin-left: -7%; display: block;
          transition: transform 0.6s ease;
        }
        .proj-card:hover .card-img { transform: scale(1.05); }

        .card-num {
          position: absolute; top: 14px; left: 14px; z-index: 2;
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.14em;
          color: rgba(255,255,255,0.9);
          background: rgba(0,0,0,0.48); backdrop-filter: blur(8px);
          padding: 5px 10px; border-radius: 100px;
        }
        .card-category {
          position: absolute; top: 14px; right: 14px; z-index: 2;
          font-family: 'DM Mono', monospace;
          font-size: 10px; font-weight: 500; letter-spacing: 0.12em;
          text-transform: uppercase; color: #000;
          padding: 5px 12px; border-radius: 100px;
        }

        .card-body { padding: 20px 22px 52px; }
        .card-name {
          font-size: clamp(18px, 2.2vw, 28px); font-weight: 700;
          color: var(--pt-text); letter-spacing: -0.02em;
          margin: 0 0 14px; line-height: 1.1;
        }
        .card-divider { width:100%; height:1px; background: var(--pt-border); margin-bottom:14px; }
        .card-skills { display:flex; flex-wrap:wrap; gap:7px; }
        .skill-tag {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.06em; color: var(--pt-muted);
          border: 1px solid var(--pt-border); border-radius: 100px; padding: 4px 12px;
          transition: color 0.25s, border-color 0.25s;
        }
        .proj-card:hover .skill-tag { color: var(--pt-text); border-color: var(--pt-muted); }

        .card-arrow {
          position: absolute; bottom: 18px; right: 18px;
          width: 34px; height: 34px; border-radius: 50%;
          border: 1px solid var(--pt-border);
          display: flex; align-items: center; justify-content: center;
          color: var(--pt-muted); font-size: 14px;
          transition: background 0.3s, color 0.3s, transform 0.3s, border-color 0.3s;
        }
        .proj-card:hover .card-arrow {
          background: var(--pt-text); color: var(--pt-bg);
          transform: rotate(45deg); border-color: var(--pt-text);
        }

        @media (max-width: 1024px) {
          .proj-header { padding: 64px 32px 36px; }
          .scroll-progress-wrap { padding: 0 32px 28px; }
          .proj-viewport { overflow: visible; padding: 0 32px 64px; }
          .proj-track { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; width: 100%; }
          .proj-card:nth-child(even) { margin-top: 0; }
          .proj-card { width: 100%; }
          .proj-hint { display: none; }
        }
        @media (max-width: 640px) {
          .proj-header { padding: 48px 20px 28px; flex-direction: column; align-items: flex-start; }
          .proj-meta { align-items: flex-start; }
          .scroll-progress-wrap { padding: 0 20px 24px; }
          .proj-viewport { padding: 0 20px 48px; }
          .proj-track { grid-template-columns: 1fr; gap: 16px; }
          .card-body { padding: 16px 18px 48px; }
        }
      `}</style>

      <div className="pin-container" ref={pinContainerRef}>

        {/* ── Intro text (zooms out as circle expands) ── */}
        <div className="proj-intro" ref={introRef}>
          <span className="proj-intro-label">Our Work</span>
          <h2 className="proj-intro-text">
            Selected <em>Works</em>
          </h2>
        </div>

        {/* ── Main content (revealed after circle completes) ── */}
        <div className="proj-content-wrapper" ref={contentRef}>
          <div className="proj-header">
            <h2 className="proj-heading">
              Selected<br /><em>Works</em>
            </h2>
            <div className="proj-meta">
              <span className="proj-count">
                {String(projects.length).padStart(2, "0")} Projects
              </span>
              <span className="proj-hint">Scroll to explore</span>
            </div>
          </div>

          <div className="scroll-progress-wrap">
            <div className="scroll-progress-bar">
              <div className="scroll-progress-fill" ref={progressRef} />
            </div>
            <span className="scroll-progress-label" ref={labelRef}>
              01 / {String(projects.length).padStart(2, "0")}
            </span>
          </div>

          <div className="proj-viewport" ref={viewportRef}>
            <div className="proj-track" ref={trackRef}>
              {projects.map((p) => (
                <article className="proj-card" key={p.id}>
                  <a href={p.link} target="_blank" rel="noreferrer" className="card-img-wrap">
                    <span className="card-num">{p.id}</span>
                    <span className="card-category" style={{ background: p.accent }}>
                      {p.category}
                    </span>
                    <img className="card-img" src={p.image} alt={p.name} loading="lazy" />
                  </a>
                  <div className="card-body">
                    <h3 className="card-name">{p.name}</h3>
                    <div className="card-divider" />
                    <div className="card-skills">
                      {p.skills.map((s) => (
                        <span className="skill-tag" key={s}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <a href={p.link} target="_blank" rel="noreferrer" className="card-arrow">↗</a>
                </article>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}