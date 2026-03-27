"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CrossedBanners() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Base speed (xPercent per second equivalent) ──────────────────────
      const BASE_SPEED_BLACK = -50; // moves LEFT
      const BASE_SPEED_WHITE =  50; // moves RIGHT

      // Tween references so we can tweak timeScale live
      const blackTween = gsap.to(".black-track", {
        xPercent: BASE_SPEED_BLACK,
        ease: "none",
        duration: 20,
        repeat: -1,
      });

      const whiteTween = gsap.to(".white-track", {
        xPercent: BASE_SPEED_WHITE,
        ease: "none",
        duration: 25,
        repeat: -1,
      });

      // ── ScrollTrigger velocity watcher ───────────────────────────────────
      // velocity > 0  → scrolling DOWN  → speed up (normal direction)
      // velocity < 0  → scrolling UP    → reverse + speed up slightly

      let currentScale = { black: 1, white: 1 };
      let rafId;

      const TARGET_SCALE  = { black: 1, white: 1 };
      const LERP           = 0.07; // smoothing (lower = smoother)
      const BOOST          = 3.5;  // multiplier at full scroll speed

      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const vel = self.getVelocity(); // px/s  (+down / -up)

          // Normalise velocity to a reasonable range [-1 … 1]
          const norm = gsap.utils.clamp(-1, 1, vel / 1200);

          if (norm >= 0) {
            // Scrolling DOWN → both bands speed up in their natural direction
            TARGET_SCALE.black =  1 + norm * BOOST;
            TARGET_SCALE.white =  1 + norm * BOOST;
          } else {
            // Scrolling UP → reverse direction, slightly faster
            TARGET_SCALE.black = norm * (BOOST * 0.7);
            TARGET_SCALE.white = norm * (BOOST * 0.7);
          }
        },
      });

      // RAF loop: lerp timeScale toward target each frame
      const tick = () => {
        currentScale.black = gsap.utils.interpolate(
          currentScale.black, TARGET_SCALE.black, LERP
        );
        currentScale.white = gsap.utils.interpolate(
          currentScale.white, TARGET_SCALE.white, LERP
        );

        blackTween.timeScale(currentScale.black);
        whiteTween.timeScale(currentScale.white);

        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);

      // Return cleanup inside ctx so gsap.context handles it
      return () => cancelAnimationFrame(rafId);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const repeat = (content) =>
    Array(12)
      .fill(null)
      .map((_, i) => (
        <span key={i} className="band-item">
          {content} <span className="star">✦</span>
        </span>
      ));

  return (
    <>
      <style>{`
        .crossed-section {
          position: relative;
          width: 100%;
          margin: 100px 0;
          padding: 50px 0;
          height: 37vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .topo-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, rgba(180,150,120,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .band-wrapper {
          position: absolute;
          width: 200%;
          left: -50%;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .band-wrapper.black {
          transform: rotate(-2deg);
          bottom: 20px;
          height: 110px;
          background: #180004;
          z-index: 2;
        }

        .band-wrapper.white {
          transform: rotate(-2deg);
          top: 10px;
          height: 110px;
          background: #ffffff;
          z-index: 3;
        }

        .band-track {
          display: flex;
          width: max-content;
          will-change: transform;
          white-space: nowrap;
        }

        .band-item {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-weight: 700;
          font-size: clamp(22px, 2.8vw, 38px);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 0 28px;
          display: inline-flex;
          align-items: center;
          gap: 16px;
        }

        .band-wrapper.black .band-item { color: #fff; }
        .band-wrapper.white .band-item { color: #111; }

        .star { font-size: 0.7em; }

        @media (max-width: 768px) {
          .crossed-section {
            margin: 60px 0;
            padding: 30px 0;
            height: 30vh;
            min-height: 200px;
          }
          .band-wrapper.black { bottom: 15px; height: 80px; }
          .band-wrapper.white { top: 15px;    height: 80px; }
          .band-item { font-size: clamp(16px, 4vw, 22px); padding: 0 20px; gap: 12px; }
          .star { font-size: 0.6em; }
        }

        @media (max-width: 480px) {
          .crossed-section {
            margin: 40px 0;
            padding: 20px 0;
            height: 25vh;
            min-height: 180px;
          }
          .band-wrapper.black { bottom: 10px; height: 60px; transform: rotate(-1deg); }
          .band-wrapper.white { top: 10px;    height: 60px; transform: rotate(-1deg); }
          .band-item { font-size: clamp(14px, 3.5vw, 18px); padding: 0 15px; gap: 10px; }
          .star { font-size: 0.5em; }
        }

        @media (max-width: 1024px) and (orientation: landscape) {
          .crossed-section { height: 25vh; min-height: 150px; }
          .band-wrapper.black,
          .band-wrapper.white { height: 70px; }
        }
      `}</style>

      <section ref={sectionRef} className="crossed-section">
        <div className="topo-bg" />

        <div className="band-wrapper black">
          <div className="band-track black-track">
            {repeat("FRONTEND DEVELOPER")}
          </div>
        </div>

        <div className="band-wrapper white" dir="rtl">
          <div className="band-track white-track">
            {repeat("REACT NEXT.js EXPERT")}
          </div>
        </div>
      </section>
    </>
  );
}