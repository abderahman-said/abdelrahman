"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CrossedBanners() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Black band infinite loop to LEFT
      gsap.to(".black-track", {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1,
      });

      // White band infinite loop to RIGHT
      gsap.to(".white-track", {
        xPercent: 50,
        ease: "none",
        duration: 25,
        repeat: -1,
      });
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
          height: 40vh;
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
          transform: rotate(-2deg);
          bottom: 10px;
          height: 130px;
          background: #0c0c0c;
          z-index: 2;
        }

        .band-wrapper.white {
          transform: rotate(-2deg);
          top: 10px ;
          height: 130px;
          background: #ffffff;
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
        <div className="band-wrapper white" dir="rtl">
          <div className="band-track white-track">
            {repeat("REACT NEXT.js EXPERT")}
          </div>
        </div>
      </section>
    </>
  );
}