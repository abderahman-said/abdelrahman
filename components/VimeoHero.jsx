'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Particles from './Particles';
import GlitchText from './GlitchText';
import Magnet from './Magnet';

gsap.registerPlugin(ScrollTrigger);

// ── Target values when fully scrolled ─────────────────────────────────────────
const MARGIN_MAX  = 30;   // px  — same as original design
const RADIUS_MAX  = 33;   // px  — same as original design
// How many pixels of scroll to reach the final values (short = snappy)
const SCROLL_DIST = 280;  // px

export default function VimeoHero() {
    const iframeRef   = useRef(null);
    const playerRef   = useRef(null);
    const bubbleRef   = useRef(null);
    const titleRef    = useRef(null);
    const controlsRef = useRef(null);
    const cvBtnRef    = useRef(null);

    const orb1Ref    = useRef(null);
    const orb2Ref    = useRef(null);
    const orb3Ref    = useRef(null);
    const badgeTLRef = useRef(null);
    const badgeTRRef = useRef(null);
    const badgeMLRef = useRef(null);

    const [isMuted,      setIsMuted]      = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    /* ────────────────────────────────────────────────────
       ⓪ Enhanced text entrance animations
    ──────────────────────────────────────────────────── */
    useEffect(() => {
        const title = titleRef.current;
        const badges = [badgeTLRef.current, badgeTRRef.current, badgeMLRef.current].filter(Boolean);
        
        if (title) {
            // Split title into words for staggered animation
            const words = title.querySelectorAll('.vimeo-hero__word');
            gsap.set(words, { opacity: 0, y: 50, rotationX: 45 });
            
            gsap.to(words, {
                opacity: 1,
                y: 0,
                rotationX: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: "power3.out",
                delay: 0.5
            });
        }
        
        // Animate badges with elastic entrance
        badges.forEach((badge, index) => {
            gsap.fromTo(badge,
                {
                    opacity: 0,
                    scale: 0,
                    rotation: Math.random() * 20 - 10
                },
                {
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    duration: 0.8,
                    delay: 1.2 + index * 0.15,
                    ease: "back.out(1.7)"
                }
            );
        });
    }, []);

    /* ────────────────────────────────────────────────────
       ⓪ Scroll → margin + border-radius
          Drives CSS custom properties so the browser
          composites width/height/radius together with
          a single layout pass per frame.
    ──────────────────────────────────────────────────── */
    useEffect(() => {
        const hero = playerRef.current;
        if (!hero) return;

        // Proxy object GSAP can tween freely
        const proxy = { margin: 0, radius: 0 };

        const st = ScrollTrigger.create({
            trigger: document.body,   // fires from page top
            start: 'top top',
            end: `+=${SCROLL_DIST}`,
            scrub: 0.6,               // smooth lag — feel free to adjust 0.3–1.2
            onUpdate(self) {
                const p = self.progress;                    // 0 → 1
                // ease-out-quad so it feels snappy at first scroll then settles
                const eased = 1 - Math.pow(1 - p, 2);

                const m = eased * MARGIN_MAX;
                const r = eased * RADIUS_MAX;

                hero.style.setProperty('--hero-margin', `${m.toFixed(2)}px`);
                hero.style.setProperty('--hero-radius', `${r.toFixed(2)}px`);
            },
        });

        return () => st.kill();
    }, []);

    /* ────────────────────────────────────────────────────
       ① Mouse Parallax — orbs track cursor at diff depths
         ② Magnetic Badges — attract toward cursor
    ──────────────────────────────────────────────────── */
    useEffect(() => {
        const hero = playerRef.current;
        if (!hero) return;

        const o1x = gsap.quickTo(orb1Ref.current, 'x', { duration: 1.8, ease: 'power2' });
        const o1y = gsap.quickTo(orb1Ref.current, 'y', { duration: 1.8, ease: 'power2' });
        const o2x = gsap.quickTo(orb2Ref.current, 'x', { duration: 2.4, ease: 'power2' });
        const o2y = gsap.quickTo(orb2Ref.current, 'y', { duration: 2.4, ease: 'power2' });
        const o3x = gsap.quickTo(orb3Ref.current, 'x', { duration: 1.4, ease: 'power2' });
        const o3y = gsap.quickTo(orb3Ref.current, 'y', { duration: 1.4, ease: 'power2' });

        const badges = [
            { el: badgeTLRef.current, strength: 28 },
            { el: badgeTRRef.current, strength: 22 },
            { el: badgeMLRef.current, strength: 25 },
        ].filter(b => b.el);

        const magneticSetters = badges.map(b => ({
            ...b,
            xTo: gsap.quickTo(b.el, 'x', { duration: 0.6, ease: 'power3' }),
            yTo: gsap.quickTo(b.el, 'y', { duration: 0.6, ease: 'power3' }),
        }));

        const MAGNETIC_RADIUS = 160;

        const onMouseMove = (e) => {
            const rect = hero.getBoundingClientRect();
            const nx = ((e.clientX - rect.left)  / rect.width  - 0.5) * 2;
            const ny = ((e.clientY - rect.top)   / rect.height - 0.5) * 2;

            o1x(nx * 55); o1y(ny * 35);
            o2x(nx * -40); o2y(ny * -28);
            o3x(nx * 25); o3y(ny * 20);

            magneticSetters.forEach(({ el, strength, xTo, yTo }) => {
                const br   = el.getBoundingClientRect();
                const bx   = br.left + br.width  / 2;
                const by   = br.top  + br.height / 2;
                const dx   = e.clientX - bx;
                const dy   = e.clientY - by;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MAGNETIC_RADIUS) {
                    const pull = 1 - dist / MAGNETIC_RADIUS;
                    xTo(dx * pull * strength / 28);
                    yTo(dy * pull * strength / 28);
                } else {
                    xTo(0); yTo(0);
                }
            });
        };

        const onMouseLeave = () => {
            [orb1Ref, orb2Ref, orb3Ref].forEach(r => {
                if (r.current) gsap.to(r.current, { x: 0, y: 0, duration: 2, ease: 'elastic.out(1,0.3)' });
            });
            magneticSetters.forEach(({ el }) => {
                gsap.to(el, { x: 0, y: 0, duration: 1.2, ease: 'elastic.out(1,0.4)' });
            });
        };

        hero.addEventListener('mousemove',  onMouseMove);
        hero.addEventListener('mouseleave', onMouseLeave);

        return () => {
            hero.removeEventListener('mousemove',  onMouseMove);
            hero.removeEventListener('mouseleave', onMouseLeave);
        };
    }, []);

    /* ────────────────────────────────────────────────────
       ③ Title letter-split hover
    ──────────────────────────────────────────────────── */
    useEffect(() => {
        const title = titleRef.current;
        if (!title) return;

        const wrapLetters = (node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                const frag = document.createDocumentFragment();
                [...node.textContent].forEach(ch => {
                    const s = document.createElement('span');
                    s.className   = 'hero-letter';
                    s.textContent = ch === ' ' ? '\u00A0' : ch;
                    frag.appendChild(s);
                });
                node.parentNode.replaceChild(frag, node);
            } else if (node.nodeType === Node.ELEMENT_NODE && !node.closest('img, svg')) {
                [...node.childNodes].forEach(wrapLetters);
            }
        };

        title.querySelectorAll('.vimeo-hero__word > span').forEach(wrapLetters);

        const onLetterEnter = (e) => {
            const letter = e.currentTarget;
            gsap.killTweensOf(letter);
            gsap.fromTo(letter,
                { y: 0, scaleY: 1, scaleX: 1 },
                { y: -10, scaleY: 1.15, scaleX: 0.9, duration: 0.35, ease: 'power2.out', yoyo: true, repeat: 1 }
            );
        };

        const letters = title.querySelectorAll('.hero-letter');
        letters.forEach(l => {
            l.style.display = 'inline-block';
            l.addEventListener('mouseenter', onLetterEnter);
        });

        return () => letters.forEach(l => l.removeEventListener('mouseenter', onLetterEnter));
    }, []);

    /* ────────────────────────────────────────────────────
       ④ Hover mute bubble
    ──────────────────────────────────────────────────── */
    useEffect(() => {
        const bubble   = bubbleRef.current;
        const hero     = playerRef.current;
        const title    = titleRef.current;
        const controls = controlsRef.current;
        if (!bubble || !hero) return;

        const xTo = gsap.quickTo(bubble, 'x', { duration: 0.5, ease: 'power3' });
        const yTo = gsap.quickTo(bubble, 'y', { duration: 0.5, ease: 'power3' });

        const onMove  = (e) => { xTo(e.clientX + 13); yTo(e.clientY - 43); };
        const onEnter = () => {
            gsap.killTweensOf(bubble, 'opacity,scale,rotation');
            gsap.to(bubble, { opacity: 1, scale: 1, rotation: 0, duration: 1.7, delay: 0.05, ease: 'elastic.out(1, 0.4)' });
        };
        const onLeave = () => {
            gsap.killTweensOf(bubble, 'opacity,scale,rotation');
            gsap.to(bubble, { opacity: 0, scale: 0, rotation: -30, duration: 0.3, ease: 'sine.inOut' });
        };
        const hideBubble = () => {
            gsap.killTweensOf(bubble, 'opacity,scale,rotation');
            gsap.to(bubble, { opacity: 0, scale: 0, rotation: -30, duration: 0.3, ease: 'sine.inOut' });
        };
        const showBubble = () => {
            gsap.killTweensOf(bubble, 'opacity,scale,rotation');
            gsap.to(bubble, { opacity: 1, scale: 1, rotation: 0, duration: 0.3, ease: 'sine.inOut' });
        };
        const onTitleEnter = () => {
            hideBubble();
            if (controls) gsap.to(controls, { opacity: 0, duration: 0.3, pointerEvents: 'none' });
        };
        const onTitleLeave = () => {
            showBubble();
            if (controls) gsap.to(controls, { opacity: 1, duration: 0.3, pointerEvents: 'auto' });
        };

        window.addEventListener('mousemove', onMove);
        hero.addEventListener('mouseenter', onEnter);
        hero.addEventListener('mouseleave', onLeave);
        if (title)    { title.addEventListener('mouseenter',    onTitleEnter); title.addEventListener('mouseleave',    onTitleLeave); }
        if (controls) { controls.addEventListener('mouseenter', hideBubble);   controls.addEventListener('mouseleave', showBubble);   }

        return () => {
            window.removeEventListener('mousemove', onMove);
            hero.removeEventListener('mouseenter', onEnter);
            hero.removeEventListener('mouseleave', onLeave);
            if (title)    { title.removeEventListener('mouseenter',    onTitleEnter); title.removeEventListener('mouseleave',    onTitleLeave); }
            if (controls) { controls.removeEventListener('mouseenter', hideBubble);   controls.removeEventListener('mouseleave', showBubble);   }
        };
    }, []);

    /* ────────────────────────────────────────────────────
       ⑤ CV Button infinite glow pulse
    ──────────────────────────────────────────────────── */
    useEffect(() => {
        const cvBtn = cvBtnRef.current;
        if (!cvBtn) return;

        gsap.to(cvBtn, {
            boxShadow:   '0px 0px 16px 2px rgba(255,255,255,0.5), inset 0px 0px 4px 1px rgba(255,255,255,0.2)',
            borderColor: 'rgba(255,255,255,0.9)',
            background:  'rgba(255,255,255,0.15)',
            duration: 1.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });

        return () => gsap.killTweensOf(cvBtn);
    }, []);

    const toggleMute = (e) => {
        if (e) e.stopPropagation();
        if (!iframeRef.current) return;
        iframeRef.current.muted = !isMuted;
        setIsMuted(m => !m);
    };

    const toggleFullscreen = (e) => {
        if (e) e.stopPropagation();
        if (!document.fullscreenElement) {
            playerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <>
            {/* Hover mute bubble */}
            <div
                ref={bubbleRef}
                className={`vimeo-mute-bubble ${isMuted ? 'is--muted' : 'is--unmuted'}`}
                style={{ pointerEvents: 'none' }}
            >
                <div className="vimeo-mute-bubble__blob">
                    <img src="/assets/VimeoHero SVG/mute-bubble-blob.svg" alt="" className="vimeo-mute-bubble__blob-svg" />
                    <div className="vimeo-mute-bubble__icon vimeo-mute-bubble__mute">
                        <svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="8" y="4" width="38" height="46" rx="4" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2.5" />
                            <rect x="14" y="11" width="12" height="12" rx="2" fill="currentColor" opacity="0.7" />
                            <rect x="28" y="13" width="13" height="3" rx="1.5" fill="currentColor" />
                            <rect x="28" y="18" width="9" height="2.5" rx="1.25" fill="currentColor" opacity="0.5" />
                            <line x1="14" y1="28" x2="40" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                            <rect x="14" y="32" width="26" height="2.5" rx="1.25" fill="currentColor" opacity="0.6" />
                            <rect x="14" y="37" width="20" height="2.5" rx="1.25" fill="currentColor" opacity="0.6" />
                            <rect x="14" y="42" width="23" height="2.5" rx="1.25" fill="currentColor" opacity="0.6" />
                        </svg>
                    </div>
                    <div className="vimeo-mute-bubble__icon vimeo-mute-bubble__unmute">
                        <svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="8" y="4" width="38" height="46" rx="4" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeWidth="2.5" opacity="0.3" />
                            <rect x="14" y="11" width="12" height="12" rx="2" fill="currentColor" opacity="0.3" />
                            <rect x="28" y="13" width="13" height="3" rx="1.5" fill="currentColor" opacity="0.3" />
                            <rect x="28" y="18" width="9" height="2.5" rx="1.25" fill="currentColor" opacity="0.3" />
                            <rect x="14" y="32" width="26" height="2.5" rx="1.25" fill="currentColor" opacity="0.3" />
                            <rect x="14" y="37" width="20" height="2.5" rx="1.25" fill="currentColor" opacity="0.3" />
                            <rect x="14" y="42" width="23" height="2.5" rx="1.25" fill="currentColor" opacity="0.3" />
                            <line x1="9" y1="45" x2="45" y2="9" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* ── Main hero container ── */}
            <div
                className={`vimeo-hero ${isMuted ? 'is-muted' : 'is-unmuted'}`}
                ref={playerRef}
                onClick={toggleMute}
            >
                <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
                    <Particles
                        particleColors={["#ffffff"]}
                        particleCount={700}
                        particleSpread={40}
                        speed={0.9}
                        particleBaseSize={500}
                        moveParticlesOnHover
                        disableRotation
                            alphaParticles={false}
                        pixelRatio="1"
                    />
                </div>

                {/* Floating badges */}
                <div className="vimeo-hero__badge vimeo-hero__badge--tl" ref={badgeTLRef}>
                    <span className="vimeo-hero__badge-dot" style={{ background: '#4ade80' }} />
                    Available for work
                </div>
                <div className="vimeo-hero__badge vimeo-hero__badge--tr" ref={badgeTRRef}>
                    <span className="vimeo-hero__badge-dot" style={{ background: '#a78bfa' }} />
                    3+ years experience
                </div>
                <div className="vimeo-hero__badge vimeo-hero__badge--ml" ref={badgeMLRef}>
                    <span className="vimeo-hero__badge-dot" style={{ background: '#38bdf8' }} />
                    React · Next.js · TypeScript
                </div>

                {/* Headline */}
                <div className="home-header__title">
                    <h1 className="vimeo-hero__title" ref={titleRef} onClick={(e) => e.stopPropagation()}>
                        <span className="vimeo-hero__word">creative </span>
                        <span className="vimeo-hero__word is--relative">
                            <GlitchText speed={1} enableShadows enableOnHover={false} className='custom-class'>
                                frontend
                            </GlitchText>
                            <div className="home-header__smiley">
                                <img src="/assets/VimeoHero SVG/smiley-face.svg" alt="" className="home-header__smiley-svg" />
                            </div>
                        </span>
                        <div style={{ flexBasis: '100%', height: 0 }} />
                        <span className="vimeo-hero__word"><em>react/next.js </em></span>
                        <span className="vimeo-hero__word is--relative">
                            <div className="home-header__star">
                                <div className="home-header__star-inner">
                                    <img src="/assets/VimeoHero SVG/pink-star.svg" alt="" className="home-header__star-svg" />
                                </div>
                            </div>
                            <img src="/assets/VimeoHero SVG/oval-underline.svg" alt="" className="home-header__title-line-svg" />
                            <span>developer</span>
                        </span>
                    </h1>
                </div>

                {/* Controls */}
                <div className="vimeo-hero__controls" ref={controlsRef} onClick={(e) => e.stopPropagation()}>
                    <Magnet padding={50} disabled={false} magnetStrength={50}>
                        <a
                            ref={cvBtnRef}
                            href="/assets/Abdulrahman-Elsaeid_next.js&&react.js.pdf"
                            download="Abdulrahman-Elsaeid_CV.pdf"
                            className="vimeo-hero__btn"
                            style={{
                                textDecoration: 'none',
                                width: 'auto',
                                padding: '0 16px',
                                gap: '8px',
                                fontSize: '13px',
                                fontWeight: '600',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                            }}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            CV
                        </a>
                    </Magnet>

                    <button className="vimeo-hero__btn" onClick={toggleFullscreen} aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                        {!isFullscreen ? (
                            <svg viewBox="0 0 20 20" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M2.5 3.95833C2.5 3.15292 3.15292 2.5 3.95833 2.5H6.875C7.22017 2.5 7.5 2.77983 7.5 3.125C7.5 3.47017 7.22017 3.75 6.875 3.75H3.95833C3.84327 3.75 3.75 3.84327 3.75 3.95833V6.875C3.75 7.22017 3.47017 7.5 3.125 7.5C2.77983 7.5 2.5 7.22017 2.5 6.875V3.95833ZM12.5 3.125C12.5 2.77983 12.7798 2.5 13.125 2.5H16.0417C16.8471 2.5 17.5 3.15292 17.5 3.95833V6.875C17.5 7.22017 17.2202 7.5 16.875 7.5C16.5298 7.5 16.25 7.22017 16.25 6.875V3.95833C16.25 3.84327 16.1567 3.75 16.0417 3.75H13.125C12.7798 3.75 12.5 3.47017 12.5 3.125ZM3.125 12.5C3.47017 12.5 3.75 12.7798 3.75 13.125V16.0417C3.75 16.1567 3.84327 16.25 3.95833 16.25H6.875C7.22017 16.25 7.5 16.5298 7.5 16.875C7.5 17.2202 7.22017 17.5 6.875 17.5H3.95833C3.15292 17.5 2.5 16.8471 2.5 16.0417V13.125C2.5 12.7798 2.77983 12.5 3.125 12.5ZM16.875 12.5C17.2202 12.5 17.5 12.7798 17.5 13.125V16.0417C17.5 16.8471 16.8471 17.5 16.0417 17.5H13.125C12.7798 17.5 12.5 17.2202 12.5 16.875C12.5 16.5298 12.7798 16.25 13.125 16.25H16.0417C16.1567 16.25 16.25 16.1567 16.25 16.0417V13.125C16.25 12.7798 16.5298 12.5 16.875 12.5Z" fill="currentColor" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 20 20" fill="none">
                                <path d="M6.04167 7.5C6.84708 7.5 7.5 6.84708 7.5 6.04167L7.5 3.125C7.5 2.77983 7.22017 2.5 6.875 2.5C6.52982 2.5 6.25 2.77983 6.25 3.125L6.25 6.04167C6.25 6.15673 6.15672 6.25 6.04167 6.25L3.125 6.25C2.77983 6.25 2.5 6.52983 2.5 6.875C2.5 7.22018 2.77983 7.5 3.125 7.5L6.04167 7.5Z" fill="currentColor" />
                                <path d="M16.875 7.5C17.2202 7.5 17.5 7.22017 17.5 6.875C17.5 6.52982 17.2202 6.25 16.875 6.25L13.9583 6.25C13.8433 6.25 13.75 6.15673 13.75 6.04167L13.75 3.125C13.75 2.77983 13.4702 2.5 13.125 2.5C12.7798 2.5 12.5 2.77983 12.5 3.125L12.5 6.04167C12.5 6.84708 13.1529 7.5 13.9583 7.5L16.875 7.5Z" fill="currentColor" />
                                <path d="M12.5 16.875C12.5 17.2202 12.7798 17.5 13.125 17.5C13.4702 17.5 13.75 17.2202 13.75 16.875L13.75 13.9583C13.75 13.8433 13.8433 13.75 13.9583 13.75L16.875 13.75C17.2202 13.75 17.5 13.4702 17.5 13.125C17.5 12.7798 17.2202 12.5 16.875 12.5L13.9583 12.5C13.1529 12.5 12.5 13.1529 12.5 13.9583L12.5 16.875Z" fill="currentColor" />
                                <path d="M6.25 16.875C6.25 17.2202 6.52982 17.5 6.875 17.5C7.22017 17.5 7.5 17.2202 7.5 16.875L7.5 13.9583C7.5 13.1529 6.84708 12.5 6.04167 12.5L3.125 12.5C2.77982 12.5 2.5 12.7798 2.5 13.125C2.5 13.4702 2.77982 13.75 3.125 13.75L6.04167 13.75C6.15672 13.75 6.25 13.8433 6.25 13.9583L6.25 16.875Z" fill="currentColor" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}