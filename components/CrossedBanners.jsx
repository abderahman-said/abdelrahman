"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CrossedBanners() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Shared ScrollTrigger config — pin the section while scrolling
      const scrollConfig = {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=150%",   // how long the pinned scroll lasts (tweak freely)
        scrub: 1.2,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      };

      // Black band scrolls LEFT  (starts at 0, ends at -25%)
      gsap.fromTo(
        ".black-track",
        { xPercent: 0 },
        {
          xPercent: -25,
          ease: "none",
          scrollTrigger: { ...scrollConfig },
        }
      );

      // White band scrolls RIGHT (starts at -25%, ends at 0)
      gsap.fromTo(
        ".white-track",
        { xPercent: -25 },
        {
          xPercent: 0,
          ease: "none",
          scrollTrigger: {
            ...scrollConfig,
            pin: false,       // piggybacks on the black band's pin
            pinSpacing: false,
          },
        }
      );
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
          min-height: 100vh;
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

        /* ── band wrapper ── */
        .band-wrapper {
          position: absolute;
          width: 200%;
          left: -50%;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .band-wrapper.black {
          transform: rotate(-19deg);
          top: calc(70% - 190px);
          height: 120px;
          background: linear-gradient(90deg, #020617 0%, #0f172a 50%, #020617 100%);
          box-shadow: 0 8px 40px rgba(0,0,0,0.25);
          z-index: 2;
        }

        .band-wrapper.white {
          transform: rotate(19deg);
          top: calc(70% - 190px);
          height: 120px;
          background: linear-gradient(90deg, #ffffff 0%, #e2e8f0 50%, #ffffff 100%);
          box-shadow: 0 8px 40px rgba(0,0,0,0.18);
          z-index: 3;
        }

        /* ── scrolling track ── */
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
      `}</style>

      <section ref={sectionRef} className="crossed-section">
        <div className="topo-bg" />

        {/* Black band */}
        <div className="band-wrapper black">
          <div className="band-track black-track">
            {repeat("FRONTEND DEVELOPER")}
          </div>
        </div>

        {/* White band */}
        <div className="band-wrapper white">
          <div className="band-track white-track">
            {repeat("REACT NEXT.js EXPERT")}
          </div>
        </div>
      </section>
    </>
  );
}