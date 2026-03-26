"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

const CHIPS = [
  { label: "HTML",         bg: "#FF6B35", tc: "#fff" },
  { label: "CSS",          bg: "#7C3AED", tc: "#fff" },
  { label: "JavaScript",   bg: "#F59E0B", tc: "#1a1200" },
  { label: "React",        bg: "#0EA5E9", tc: "#fff" },
  { label: "Next.js",      bg: "#18181b", tc: "#f4f4f5" },
  { label: "TypeScript",   bg: "#3178C6", tc: "#fff" },
  { label: "GSAP",         bg: "#0AE448", tc: "#002b10" },
  { label: "Tailwind",     bg: "#06B6D4", tc: "#fff" },
  { label: "Redux",        bg: "#764ABC", tc: "#fff" },
  { label: "React Query",  bg: "#FF4154", tc: "#fff" },
  { label: "Axios",        bg: "#5A29E4", tc: "#fff" },
  { label: "Sass",         bg: "#CC6699", tc: "#fff" },
  { label: "Git",          bg: "#F05032", tc: "#fff" },
];

const getRandom = (min, max) => Math.random() * (max - min) + min;

export default function GSAPCardGrid() {
  const sceneRef   = useRef(null);
  const bodiesRef  = useRef([]);
  const rafRef     = useRef(null);
  const dragState  = useRef(null); // { body, offX, offY, prevMx, prevMy, mx, my }

  // ─── physics tick ─────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const W = scene.offsetWidth;
    const H = scene.offsetHeight;
    const DAMP = 0.984, MAX_V = 14, FRICTION = 0.995;

    bodiesRef.current.forEach((b) => {
      if (b.dragging) return;
      b.vx = Math.max(-MAX_V, Math.min(MAX_V, b.vx * DAMP));
      b.vy = Math.max(-MAX_V, Math.min(MAX_V, b.vy * DAMP));
      b.x += b.vx;
      b.y += b.vy;
      b.rv *= FRICTION;
      b.rot += b.rv;
      // wall bounce
      if (b.x < 0)          { b.x = 0;         b.vx =  Math.abs(b.vx) * 0.7; b.rv *= -0.5; }
      if (b.x + b.w > W)    { b.x = W - b.w;   b.vx = -Math.abs(b.vx) * 0.7; b.rv *= -0.5; }
      if (b.y < 0)          { b.y = 0;         b.vy =  Math.abs(b.vy) * 0.7; b.rv *= -0.5; }
      if (b.y + b.h > H-30) { b.y = H-30-b.h; b.vy = -Math.abs(b.vy) * 0.7; b.rv *= -0.5; }
      applyTransform(b);
    });

    // collision pairs
    const bs = bodiesRef.current;
    for (let i = 0; i < bs.length; i++)
      for (let j = i + 1; j < bs.length; j++)
        resolveCollision(bs[i], bs[j]);

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // ─── helpers ──────────────────────────────────────────────────────────────
  function applyTransform(b) {
    b.el.style.left      = b.x + "px";
    b.el.style.top       = b.y + "px";
    b.el.style.transform = `rotate(${b.rot}deg)`;
  }

  function resolveCollision(a, b) {
    const ax = a.x + a.w / 2, ay = a.y + a.h / 2;
    const bx = b.x + b.w / 2, by = b.y + b.h / 2;
    const dx = bx - ax, dy = by - ay;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const minDist = ((a.w + b.w) / 2 + (a.h + b.h) / 2) / 2 * 1.05;
    if (dist > minDist) return;

    const nx = dx / dist, ny = dy / dist;
    const overlap = minDist - dist;
    if (!a.dragging) { a.x -= nx * overlap * 0.5; a.y -= ny * overlap * 0.5; }
    if (!b.dragging) { b.x += nx * overlap * 0.5; b.y += ny * overlap * 0.5; }

    const rvx = b.vx - a.vx, rvy = b.vy - a.vy;
    const dot = rvx * nx + rvy * ny;
    if (dot > 0) return;

    const restitution = 0.65;
    const impulse = -(1 + restitution) * dot / (1 / a.mass + 1 / b.mass);
    if (!a.dragging) { a.vx -= (impulse / a.mass) * nx; a.vy -= (impulse / a.mass) * ny; }
    if (!b.dragging) { b.vx += (impulse / b.mass) * nx; b.vy += (impulse / b.mass) * ny; }

    // spin transfer
    const spinT = (a.rv - b.rv) * 0.3;
    if (!a.dragging) a.rv += spinT;
    if (!b.dragging) b.rv -= spinT;

    // flash effect via GSAP
    gsap.fromTo(b.el, { filter: "brightness(1.5)" }, { filter: "brightness(1)", duration: 0.25 });
    gsap.fromTo(a.el, { filter: "brightness(1.5)" }, { filter: "brightness(1)", duration: 0.25 });
  }

  // ─── init ─────────────────────────────────────────────────────────────────
  const initBodies = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const scene = sceneRef.current;
    if (!scene) return;
    const W = scene.offsetWidth, H = scene.offsetHeight;

    // remove old chips
    scene.querySelectorAll(".skill-chip").forEach((el) => el.remove());
    bodiesRef.current = [];

    CHIPS.forEach((data, i) => {
      const el = document.createElement("div");
      el.className = "skill-chip";
      el.textContent = data.label;
      Object.assign(el.style, {
        position:       "absolute",
        padding:        "9px 25px",
        borderRadius:   "100px",
        fontSize:       "12px",
        fontWeight:     "500",
        letterSpacing:  "0.07em",
        textTransform:  "uppercase",
        fontFamily:     "'DM Mono', monospace",
        background:     data.bg,
        color:          data.tc,
        border:         "0.5px solid rgba(255,255,255,0.2)",
        cursor:         "grab",
        userSelect:     "none",
        willChange:     "transform",
        whiteSpace:     "nowrap",
        zIndex:         String(i + 1),
      });
      scene.appendChild(el);

      const w = el.offsetWidth, h = el.offsetHeight;
      const body = {
        el, w, h,
        x:        getRandom(8, W - w - 8),
        y:        getRandom(8, H - h - 40),
        vx:       getRandom(-2, 2),
        vy:       getRandom(-2, 2),
        rot:      getRandom(-28, 28),
        rv:       getRandom(-0.4, 0.4),
        mass:     w * h,
        dragging: false,
      };
      bodiesRef.current.push(body);
      applyTransform(body);
    });

    // entrance animation
    gsap.fromTo(
      bodiesRef.current.map((b) => b.el),
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.7, stagger: 0.045, ease: "back.out(1.7)" }
    );

    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  // ─── pointer events ───────────────────────────────────────────────────────
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const onDown = (e) => {
      const chip = e.target.closest(".skill-chip");
      if (!chip) return;
      const body = bodiesRef.current.find((b) => b.el === chip);
      if (!body) return;
      e.preventDefault();
      const sr  = scene.getBoundingClientRect();
      const cr  = chip.getBoundingClientRect();
      const mx  = e.clientX - sr.left;
      const my  = e.clientY - sr.top;
      dragState.current = {
        body,
        offX:   e.clientX - cr.left,
        offY:   e.clientY - cr.top,
        prevMx: mx, prevMy: my,
        mx, my,
      };
      body.dragging = true;
      body.vx = 0; body.vy = 0;
      chip.style.cursor  = "grabbing";
      chip.style.zIndex  = "9999";
      scene.setPointerCapture(e.pointerId);
    };

    const onMove = (e) => {
      const ds = dragState.current;
      if (!ds) return;
      const sr = scene.getBoundingClientRect();
      ds.prevMx = ds.mx; ds.prevMy = ds.my;
      ds.mx = e.clientX - sr.left;
      ds.my = e.clientY - sr.top;
      const b = ds.body;
      b.x = Math.max(0, Math.min(scene.offsetWidth  - b.w, ds.mx - ds.offX));
      b.y = Math.max(0, Math.min(scene.offsetHeight - b.h - 30, ds.my - ds.offY));
      applyTransform(b);
    };

    const onUp = (e) => {
      const ds = dragState.current;
      if (!ds) return;
      const THROW = 4.5;
      ds.body.vx = (ds.mx - ds.prevMx) * THROW;
      ds.body.vy = (ds.my - ds.prevMy) * THROW;
      ds.body.dragging = false;
      ds.body.el.style.cursor = "grab";
      ds.body.el.style.zIndex = "";
      dragState.current = null;
    };

    scene.addEventListener("pointerdown", onDown);
    scene.addEventListener("pointermove", onMove);
    scene.addEventListener("pointerup",   onUp);
    return () => {
      scene.removeEventListener("pointerdown", onDown);
      scene.removeEventListener("pointermove", onMove);
      scene.removeEventListener("pointerup",   onUp);
    };
  }, []);

  // ─── mount / unmount ──────────────────────────────────────────────────────
  useEffect(() => {
    // wait a frame for layout
    const id = setTimeout(initBodies, 60);
    return () => {
      clearTimeout(id);
      cancelAnimationFrame(rafRef.current);
    };
  }, [initBodies]);

  return (
    <>
      <style>{`
        .skills-scene {
          position: relative;
          width: 100%;
          height: 560px;
          background: #0c0c0c;
          border-radius: 20px;
          overflow: hidden;
          cursor: default;
        }

        /* big bg word */
        .skills-bg-word {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          user-select: none;
          font-family: 'Syne', sans-serif;
          font-size: clamp(60px, 14vw, 140px);
          font-weight: 800;
          color: rgba(255,255,255,0.04);
          letter-spacing: -0.05em;
        }

        /* corner hint */
        .skills-hint {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          color: rgba(255,255,255,0.2);
          pointer-events: none;
          text-transform: uppercase;
        }

        /* shuffle button */
        .skills-shuffle {
          position: absolute;
          top: 16px;
          right: 16px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.5);
          border: 0.5px solid rgba(255,255,255,0.12);
          padding: 6px 16px;
          border-radius: 100px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .skills-shuffle:hover {
          background: rgba(255,255,255,0.13);
          color: rgba(255,255,255,0.9);
        }

        /* section wrapper */
        .skills-section {
          padding: 10px 10px;
          max-width:1400px ;
          margin:auto;
        }

        .skills-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .skills-title {
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 800;
          color: #f0ece4;
          letter-spacing: -0.04em;
          line-height: 1;
          margin: 0;
        }
        .skills-title em {
          font-style: italic;
          font-weight: 400;
          color: transparent;
          -webkit-text-stroke: 1.5px #f0ece4;
        }

        .skills-sub {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          color: #5a5a5a;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
      `}</style>

      <section className="skills-section">
        <div className="skills-scene" ref={sceneRef}>
          <div className="skills-bg-word">SKILLS</div>
          <button
            className="skills-shuffle"
            onClick={initBodies}
          >
            shuffle ↺
          </button>
          <div className="skills-hint">grab a card and throw it</div>
        </div>
      </section>
    </>
  );
}