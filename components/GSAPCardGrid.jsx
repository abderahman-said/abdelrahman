"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const FallingText = dynamic(() => import('./FallingText'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '460px' }} />
});

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

export default function GSAPCardGrid() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
      setIsTablet(window.innerWidth > 480 && window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const chipsText = CHIPS.map(chip => chip.label).join(' ');
  const highlightWords = CHIPS.map(chip => chip.label);

  // Adjust physics parameters for mobile devices
  const gravity = isMobile ? 0.4 : isTablet ? 0.5 : 0.56;
  const mouseConstraintStiffness = isMobile ? 0.7 : 0.9;

  return (
    <>
      <style>{`
        .skills-scene {
          position: relative;
          width: 100%;
          height: 460px;
          background: #0c0c0c;
          border-radius: 20px;
          overflow: hidden;
          cursor: default;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .skills-scene {
            height: 380px;
            border-radius: 16px;
          }
        }

        @media (max-width: 480px) {
          .skills-scene {
            height: 320px;
            border-radius: 12px;
          }
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
          font-size: clamp(32px, 8vw, 80px);
          font-weight: 800;
          color: rgba(255,255,255,0.04);
          letter-spacing: -0.05em;
        }

        @media (max-width: 768px) {
          .skills-bg-word {
            font-size: clamp(28px, 7vw, 60px);
          }
        }

        @media (max-width: 480px) {
          .skills-bg-word {
            font-size: clamp(24px, 6vw, 48px);
          }
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

        @media (max-width: 768px) {
          .skills-hint {
            font-size: 10px;
            bottom: 12px;
          }
        }

        @media (max-width: 480px) {
          .skills-hint {
            font-size: 9px;
            bottom: 10px;
            letter-spacing: 0.1em;
          }
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

        @media (max-width: 768px) {
          .skills-shuffle {
            font-size: 10px;
            padding: 5px 12px;
            top: 12px;
            right: 12px;
          }
        }

        @media (max-width: 480px) {
          .skills-shuffle {
            font-size: 9px;
            padding: 4px 10px;
            top: 10px;
            right: 10px;
          }
        }

        /* section wrapper */
        .skills-section {
          padding: 10px 10px;
          max-width: 800px;
          margin: auto;
        }

        @media (max-width: 768px) {
          .skills-section {
            padding: 8px 8px;
            max-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .skills-section {
            padding: 6px 6px;
            max-width: 100%;
          }
        }

        .skills-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        @media (max-width: 768px) {
          .skills-header {
            margin-bottom: 24px;
            gap: 12px;
          }
        }

        @media (max-width: 480px) {
          .skills-header {
            margin-bottom: 20px;
            gap: 8px;
            flex-direction: column;
            align-items: flex-start;
          }
        }

        .skills-title {
          font-size: clamp(28px, 4.5vw, 64px);
          font-weight: 800;
          color: #f0ece4;
          letter-spacing: -0.04em;
          line-height: 1;
          margin: 0;
        }

        @media (max-width: 768px) {
          .skills-title {
            font-size: clamp(24px, 4vw, 48px);
          }
        }

        @media (max-width: 480px) {
          .skills-title {
            font-size: clamp(20px, 3.5vw, 36px);
          }
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

        @media (max-width: 768px) {
          .skills-sub {
            font-size: 10px;
            letter-spacing: 0.12em;
          }
        }

        @media (max-width: 480px) {
          .skills-sub {
            font-size: 9px;
            letter-spacing: 0.1em;
            margin-bottom: 4px;
          }
        }

        /* Custom styles for FallingText chips */
        .falling-text-container .word {
          padding: 9px 25px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          font-family: 'DM Mono', monospace;
          border: 0.5px solid rgba(255,255,255,0.2);
          cursor: grab;
          user-select: none;
          white-space: nowrap;
          margin: 0 4px;
        }

        @media (max-width: 768px) {
          .falling-text-container .word {
            padding: 7px 20px;
            font-size: 11px;
            margin: 0 3px;
          }
        }

        @media (max-width: 480px) {
          .falling-text-container .word {
            padding: 6px 16px;
            font-size: 10px;
            margin: 0 2px;
            letter-spacing: 0.05em;
          }
        }

        .falling-text-container .word:nth-child(1) { background: #FF6B35; color: #fff; }
        .falling-text-container .word:nth-child(2) { background: #7C3AED; color: #fff; }
        .falling-text-container .word:nth-child(3) { background: #F59E0B; color: #1a1200; }
        .falling-text-container .word:nth-child(4) { background: #0EA5E9; color: #fff; }
        .falling-text-container .word:nth-child(5) { background: #18181b; color: #f4f4f5; }
        .falling-text-container .word:nth-child(6) { background: #3178C6; color: #fff; }
        .falling-text-container .word:nth-child(7) { background: #0AE448; color: #002b10; }
        .falling-text-container .word:nth-child(8) { background: #06B6D4; color: #fff; }
        .falling-text-container .word:nth-child(9) { background: #764ABC; color: #fff; }
        .falling-text-container .word:nth-child(10) { background: #FF4154; color: #fff; }
        .falling-text-container .word:nth-child(11) { background: #5A29E4; color: #fff; }
        .falling-text-container .word:nth-child(12) { background: #CC6699; color: #fff; }
        .falling-text-container .word:nth-child(13) { background: #F05032; color: #fff; }
      `}</style>

      <section className="skills-section">
        <div className="skills-scene">
          <div className="skills-bg-word">SKILLS</div>
          <FallingText
            text={chipsText}
            highlightWords={highlightWords}
            highlightClass="highlighted"
            trigger="hover"
            backgroundColor="transparent"
            wireframes={false}
            gravity={gravity}
            fontSize="12px"
            mouseConstraintStiffness={mouseConstraintStiffness}
          />
          <div className="skills-hint">grab a card and throw it</div>
        </div>
      </section>
    </>
  );
}