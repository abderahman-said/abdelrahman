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

export default function ProjectsSection() {
  /**
   * Architecture:
   *  pinContainerRef  — GSAP pins this. Must have NO overflow:hidden.
   *  viewportRef      — Has overflow:hidden. Clips the moving track.
   *  trackRef         — The flex-row that GSAP translates on X.
   */
  const pinContainerRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const headingRef = useRef(null);
  const progressRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    const isDesktop = () => window.innerWidth > 1024;

    // How far the track needs to travel
    const getDistance = () => track.scrollWidth - viewport.offsetWidth;

    // ── Heading entrance ──────────────────────────────────────────────
    gsap.fromTo(
      headingRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: {
          trigger: pinContainerRef.current,
          start: "top 85%",
        },
      }
    );

    // ── Card stagger entrance ─────────────────────────────────────────
    gsap.fromTo(
      ".proj-card",
      { y: 60, opacity: 0, scale: 0.94 },
      {
        y: 0, opacity: 1, scale: 1,
        stagger: 0.07, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: pinContainerRef.current,
          start: "top 80%",
        },
      }
    );

    let horizST = null;

    if (isDesktop()) {
      // ── Horizontal scroll (desktop only) ────────────────────────────
      const horizAnim = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        paused: true,
      });

      horizST = ScrollTrigger.create({
        trigger: pinContainerRef.current,
        start: "top top",
        end: () => `+=${getDistance()}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: horizAnim,
        onUpdate(self) {
          if (progressRef.current) {
            progressRef.current.style.width = `${self.progress * 100}%`;
          }
          if (labelRef.current) {
            const idx = Math.min(
              projects.length - 1,
              Math.floor(self.progress * projects.length)
            );
            labelRef.current.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;
          }
        },
      });

      // ── Image parallax (desktop only) ─────────────────────────────
      gsap.utils.toArray(".card-img").forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -7 },
          {
            xPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: pinContainerRef.current,
              start: "top top",
              end: () => `+=${getDistance()}`,
              scrub: 2.5,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    }

    return () => {
      if (horizST) horizST.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

        :root {
          --bg      : #0c0c0c;
          --surface : #141414;
          --text    : #f0ece4;
          --muted   : #5a5a5a;
          --border  : rgba(255,255,255,0.07);
        }

        /* ─────────────────────────────────────────
           PIN CONTAINER
           CRITICAL: no overflow:hidden here — GSAP
           needs to measure & pin this element freely
        ───────────────────────────────────────── */
        .pin-container {
          background: var(--bg);
          width: 100%;
          font-family: 'Syne', sans-serif;
        }

        /* Header */
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
          color: var(--text);
          line-height: 0.92;
          letter-spacing: -0.04em;
          margin: 0;
        }
        .proj-heading em {
          font-style: italic;
          font-weight: 400;
          color: transparent;
          -webkit-text-stroke: 1.5px var(--text);
        }
        .proj-meta {
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 8px; padding-bottom: 8px;
        }
        .proj-count {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.18em;
          color: var(--muted); text-transform: uppercase;
        }
        .proj-hint {
          font-family: 'DM Mono', monospace;
          font-size: 11px; color: var(--muted);
          display: flex; align-items: center; gap: 8px;
          letter-spacing: 0.08em;
        }
        .proj-hint::before {
          content:''; width:28px; height:1px;
          background: var(--muted); display:inline-block;
        }

        /* Progress bar */
        .scroll-progress-wrap {
          padding: 0 72px 36px;
          display: flex; align-items: center; gap: 16px;
        }
        .scroll-progress-bar {
          flex: 1; height: 1px;
          background: var(--border); border-radius: 2px; overflow: hidden;
        }
        .scroll-progress-fill {
          height: 100%; width: 0%;
          background: var(--text);
          transition: width 0.08s linear;
        }
        .scroll-progress-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.12em; color: var(--muted);
          min-width: 48px; text-align: right;
        }

        /* ─────────────────────────────────────────
           VIEWPORT  — this one clips the track.
           Separate from pin-container so GSAP pin
           is never blocked by overflow:hidden.
        ───────────────────────────────────────── */
        .proj-viewport {
          overflow: hidden;
          padding: 0 72px 80px;
        }

        /* ─────────────────────────────────────────
           RESPONSIVE — tablet & mobile
        ───────────────────────────────────────── */
        @media (max-width: 1024px) {
          .proj-header {
            padding: 64px 32px 36px;
          }
          .scroll-progress-wrap {
            padding: 0 32px 28px;
          }
          /* Switch viewport to normal flow — no horizontal scroll */
          .proj-viewport {
            overflow: visible;
            padding: 0 32px 64px;
          }
          /* Grid layout instead of horizontal flex track */
          .proj-track {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            width: 100%;
          }
          /* Reset staggered offset on even cards */
          .proj-card:nth-child(even) { margin-top: 0; }
          .proj-card { width: 100%; }
          /* Hide scroll hint on tablet — it's a vertical list now */
          .proj-hint { display: none; }
        }

        @media (max-width: 640px) {
          .proj-header {
            padding: 48px 20px 28px;
            flex-direction: column;
            align-items: flex-start;
          }
          .proj-meta { align-items: flex-start; }
          .scroll-progress-wrap { padding: 0 20px 24px; }
          .proj-viewport { padding: 0 20px 48px; }
          /* Single column on phones */
          .proj-track {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .card-body { padding: 16px 18px 48px; }
        }

        /* Track */
        .proj-track {
          display: flex;
          gap: 24px;
          width: max-content;
          will-change: transform;
          align-items: flex-start;
        }

        /* Card */
        .proj-card {
          width: clamp(300px, 26vw, 420px);
          border-radius: 16px;
          overflow: hidden;
          background: var(--surface);
          border: 1px solid var(--border);
          cursor: pointer;
          flex-shrink: 0;
          position: relative;
          transition: border-color 0.3s;
        }
        .proj-card:hover { border-color: rgba(255,255,255,0.2); }
        .proj-card:nth-child(even) { margin-top: 52px; }

        /* Image */
        .card-img-wrap {
          width: 100%; aspect-ratio: 4/3;
          overflow: hidden; position: relative;
        }
        .card-img {
          width: 114%; height: 250px;
          object-fit: cover; margin-left: -7%;
          display: block;
          transition: transform 0.6s ease;
        }
        .proj-card:hover .card-img { transform: scale(1.05); }

        .card-num {
          position: absolute; top: 14px; left: 14px; z-index: 2;
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.14em;
          color: rgba(255,255,255,0.9);
          background: rgba(0,0,0,0.48);
          backdrop-filter: blur(8px);
          padding: 5px 10px; border-radius: 100px;
        }
        .card-category {
          position: absolute; top: 14px; right: 14px; z-index: 2;
          font-family: 'DM Mono', monospace;
          font-size: 10px; font-weight: 500; letter-spacing: 0.12em;
          text-transform: uppercase; color: #000;
          padding: 5px 12px; border-radius: 100px;
        }

        /* Body */
        .card-body { padding: 20px 22px 52px; }
        .card-name {
          font-size: clamp(18px, 2.2vw, 28px); font-weight: 700;
          color: var(--text); letter-spacing: -0.02em;
          margin: 0 0 14px; line-height: 1.1;
        }
        .card-divider {
          width:100%; height:1px;
          background: var(--border); margin-bottom:14px;
        }
        .card-skills { display:flex; flex-wrap:wrap; gap:7px; }
        .skill-tag {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.06em;
          color: var(--muted);
          border: 1px solid var(--border);
          border-radius: 100px; padding: 4px 12px;
          transition: color 0.25s, border-color 0.25s;
        }
        .proj-card:hover .skill-tag {
          color: var(--text); border-color: rgba(255,255,255,0.2);
        }

        /* Arrow */
        .card-arrow {
          position: absolute; bottom: 18px; right: 18px;
          width: 34px; height: 34px; border-radius: 50%;
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--muted); font-size: 14px;
          transition: background 0.3s, color 0.3s, transform 0.3s, border-color 0.3s;
        }
        .proj-card:hover .card-arrow {
          background: var(--text); color: #000;
          transform: rotate(45deg); border-color: var(--text);
        }
      `}</style>

      {/* ── Outer pin container — NO overflow:hidden ── */}
      <div className="pin-container" ref={pinContainerRef}>

        <div className="proj-header" ref={headingRef}>
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

        {/* Progress */}
        <div className="scroll-progress-wrap">
          <div className="scroll-progress-bar">
            <div className="scroll-progress-fill" ref={progressRef} />
          </div>
          <span className="scroll-progress-label" ref={labelRef}>
            01 / {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        {/* Viewport clips the track */}
        <div className="proj-viewport" ref={viewportRef}>
          <div className="proj-track" ref={trackRef}>
            {projects.map((p) => (
              <article className="proj-card" key={p.id}>
                <a href={p.link} target="_blank" className="card-img-wrap">
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
                <a href={p.link} target="_blank" className="card-arrow">
                  ↗
                </a>
              </article>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}