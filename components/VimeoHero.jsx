'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function VimeoHero() {
    const iframeRef = useRef(null);
    const playerRef = useRef(null);
    const bubbleRef = useRef(null);
    const titleRef = useRef(null);
    const controlsRef = useRef(null);

    // Interactive refs
    const orb1Ref = useRef(null);
    const orb2Ref = useRef(null);
    const orb3Ref = useRef(null);
    const badgeTLRef = useRef(null);
    const badgeTRRef = useRef(null);
    const badgeMLRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Native video loads immediately enough that we don't need a heavy ready listener.
    // We already handle `setIsLoaded(true)` directly on the <video onLoadedData={...}> element.

    /* ────────────────────────────────────────────────────
       ① Mouse Parallax — orbs track cursor at diff depths
          ② Magnetic Badges — attract toward cursor
    ──────────────────────────────────────────────────── */
    useEffect(() => {
        const hero = playerRef.current;
        if (!hero) return;

        // — Parallax quickTo setters for each orb (different depths) —
        const o1x = gsap.quickTo(orb1Ref.current, 'x', { duration: 1.8, ease: 'power2' });
        const o1y = gsap.quickTo(orb1Ref.current, 'y', { duration: 1.8, ease: 'power2' });
        const o2x = gsap.quickTo(orb2Ref.current, 'x', { duration: 2.4, ease: 'power2' });
        const o2y = gsap.quickTo(orb2Ref.current, 'y', { duration: 2.4, ease: 'power2' });
        const o3x = gsap.quickTo(orb3Ref.current, 'x', { duration: 1.4, ease: 'power2' });
        const o3y = gsap.quickTo(orb3Ref.current, 'y', { duration: 1.4, ease: 'power2' });

        // — Magnetic badge quickTo setters —
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
            // Normalize -1 to +1 relative to hero center
            const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

            // Parallax — deeper orbs move less
            o1x(nx * 55); o1y(ny * 35);
            o2x(nx * -40); o2y(ny * -28);
            o3x(nx * 25); o3y(ny * 20);

            // Magnetic badges
            magneticSetters.forEach(({ el, strength, xTo, yTo }) => {
                const br = el.getBoundingClientRect();
                const bx = br.left + br.width / 2;
                const by = br.top + br.height / 2;
                const dx = e.clientX - bx;
                const dy = e.clientY - by;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MAGNETIC_RADIUS) {
                    const pull = (1 - dist / MAGNETIC_RADIUS);
                    xTo(dx * pull * strength / 28);
                    yTo(dy * pull * strength / 28);
                } else {
                    xTo(0); yTo(0);
                }
            });
        };

        const onMouseLeave = () => {
            // Snap everything back on leave
            [orb1Ref, orb2Ref, orb3Ref].forEach(r => {
                if (r.current) gsap.to(r.current, { x: 0, y: 0, duration: 2, ease: 'elastic.out(1,0.3)' });
            });
            magneticSetters.forEach(({ el }) => {
                gsap.to(el, { x: 0, y: 0, duration: 1.2, ease: 'elastic.out(1,0.4)' });
            });
        };

        hero.addEventListener('mousemove', onMouseMove);
        hero.addEventListener('mouseleave', onMouseLeave);

        return () => {
            hero.removeEventListener('mousemove', onMouseMove);
            hero.removeEventListener('mouseleave', onMouseLeave);
        };
    }, []);

    /* ────────────────────────────────────────────────────
       ③ Title letter-split hover — each letter pops with
          elastic bounce on mouseenter, resets on leave
    ──────────────────────────────────────────────────── */
    useEffect(() => {
        const title = titleRef.current;
        if (!title) return;

        // Wrap every bare text character inside a <span>
        const wrapLetters = (node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                const frag = document.createDocumentFragment();
                [...node.textContent].forEach(ch => {
                    const s = document.createElement('span');
                    s.className = 'hero-letter';
                    s.textContent = ch === ' ' ? '\u00A0' : ch;
                    frag.appendChild(s);
                });
                node.parentNode.replaceChild(frag, node);
            } else if (node.nodeType === Node.ELEMENT_NODE && !node.closest('img, svg')) {
                // Clone childNodes array — live list changes as we mutate
                [...node.childNodes].forEach(wrapLetters);
            }
        };

        // Only wrap inside .vimeo-hero__word spans to preserve SVG elements
        title.querySelectorAll('.vimeo-hero__word > span').forEach(wrapLetters);

        const onLetterEnter = (e) => {
            const letter = e.currentTarget;
            gsap.killTweensOf(letter);
            gsap.fromTo(letter,
                { y: 0, scaleY: 1, scaleX: 1, color: 'inherit' },
                {
                    y: -10, scaleY: 1.15, scaleX: 0.9,
                    duration: 0.35, ease: 'power2.out',
                    yoyo: true, repeat: 1
                }
            );
        };

        const letters = title.querySelectorAll('.hero-letter');
        letters.forEach(l => {
            l.style.display = 'inline-block';
            l.addEventListener('mouseenter', onLetterEnter);
        });

        return () => {
            letters.forEach(l => l.removeEventListener('mouseenter', onLetterEnter));
        };
    }, []);

    /* ────────────────────────────────────────────────────
       ④ Hover mute bubble — same GSAP elastic spring as CursorBubble
    ──────────────────────────────────────────────────── */
    useEffect(() => {
        const bubble = bubbleRef.current;
        const hero = playerRef.current;
        const title = titleRef.current;
        const controls = controlsRef.current;
        if (!bubble || !hero) return;

        const xTo = gsap.quickTo(bubble, 'x', { duration: 0.5, ease: 'power3' });
        const yTo = gsap.quickTo(bubble, 'y', { duration: 0.5, ease: 'power3' });

        const onMove = (e) => {
            xTo(e.clientX + 13);
            yTo(e.clientY - 43);
        };

        const onEnter = () => {
            gsap.killTweensOf(bubble, 'opacity,scale,rotation');
            gsap.to(bubble, { opacity: 1, scale: 1, rotation: 0, duration: 1.7, delay: 0.05, ease: 'elastic.out(1, 0.4)' });
        };

        const onLeave = () => {
            gsap.killTweensOf(bubble, 'opacity,scale,rotation');
            gsap.to(bubble, { opacity: 0, scale: 0, rotation: -30, duration: 0.3, ease: 'sine.inOut' });
        };

        const hideBubbleForElement = () => {
            gsap.killTweensOf(bubble, 'opacity,scale,rotation');
            gsap.to(bubble, { opacity: 0, scale: 0, rotation: -30, duration: 0.3, ease: 'sine.inOut' });
        };

        const showBubbleForElement = () => {
            gsap.killTweensOf(bubble, 'opacity,scale,rotation');
            gsap.to(bubble, { opacity: 1, scale: 1, rotation: 0, duration: 0.3, ease: 'sine.inOut' });
        };

        const onTitleEnter = () => {
            hideBubbleForElement();
            if (controls) gsap.to(controls, { opacity: 0, duration: 0.3, pointerEvents: 'none' });
        };

        const onTitleLeave = () => {
            showBubbleForElement();
            if (controls) gsap.to(controls, { opacity: 1, duration: 0.3, pointerEvents: 'auto' });
        };

        window.addEventListener('mousemove', onMove);
        hero.addEventListener('mouseenter', onEnter);
        hero.addEventListener('mouseleave', onLeave);

        if (title) {
            title.addEventListener('mouseenter', onTitleEnter);
            title.addEventListener('mouseleave', onTitleLeave);
        }
        if (controls) {
            controls.addEventListener('mouseenter', hideBubbleForElement);
            controls.addEventListener('mouseleave', showBubbleForElement);
        }

        return () => {
            window.removeEventListener('mousemove', onMove);
            hero.removeEventListener('mouseenter', onEnter);
            hero.removeEventListener('mouseleave', onLeave);

            if (title) {
                title.removeEventListener('mouseenter', onTitleEnter);
                title.removeEventListener('mouseleave', onTitleLeave);
            }
            if (controls) {
                controls.removeEventListener('mouseenter', hideBubbleForElement);
                controls.removeEventListener('mouseleave', showBubbleForElement);
            }
        };
    }, []);

    /* ── Controls ── */
    const togglePlay = (e) => {
        if (e) e.stopPropagation();
        if (!iframeRef.current) return;
        if (isPlaying) {
            iframeRef.current.pause();
        } else {
            iframeRef.current.play();
        }
        setIsPlaying(p => !p);
    };

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
            {/* ④ Hover mute bubble — follows cursor over the video */}
            <div
                ref={bubbleRef}
                className={`vimeo-mute-bubble ${isMuted ? 'is--muted' : 'is--unmuted'}`}
                style={{ pointerEvents: 'none' }}
            >
                <div className="vimeo-mute-bubble__blob">
                    {/* Blob shape */}
                    <img
                        src="/assets/VimeoHero SVG/mute-bubble-blob.svg"
                        alt=""
                        className="vimeo-mute-bubble__blob-svg"
                    />
                    {/* CV icon — sound ON, click to mute */}
                    <div className="vimeo-mute-bubble__icon vimeo-mute-bubble__mute">
                        <svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Document body */}
                            <rect x="8" y="4" width="38" height="46" rx="4" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2.5"/>
                            {/* Photo placeholder */}
                            <rect x="14" y="11" width="12" height="12" rx="2" fill="currentColor" opacity="0.7"/>
                            {/* Name line */}
                            <rect x="28" y="13" width="13" height="3" rx="1.5" fill="currentColor"/>
                            <rect x="28" y="18" width="9" height="2.5" rx="1.25" fill="currentColor" opacity="0.5"/>
                            {/* Divider */}
                            <line x1="14" y1="28" x2="40" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
                            {/* Text lines */}
                            <rect x="14" y="32" width="26" height="2.5" rx="1.25" fill="currentColor" opacity="0.6"/>
                            <rect x="14" y="37" width="20" height="2.5" rx="1.25" fill="currentColor" opacity="0.6"/>
                            <rect x="14" y="42" width="23" height="2.5" rx="1.25" fill="currentColor" opacity="0.6"/>
                        </svg>
                    </div>
                    {/* CV icon with slash — muted, click to unmute */}
                    <div className="vimeo-mute-bubble__icon vimeo-mute-bubble__unmute">
                        <svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Document body (dimmed) */}
                            <rect x="8" y="4" width="38" height="46" rx="4" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeWidth="2.5" opacity="0.3"/>
                            {/* Photo placeholder (dimmed) */}
                            <rect x="14" y="11" width="12" height="12" rx="2" fill="currentColor" opacity="0.3"/>
                            {/* Lines (dimmed) */}
                            <rect x="28" y="13" width="13" height="3" rx="1.5" fill="currentColor" opacity="0.3"/>
                            <rect x="28" y="18" width="9" height="2.5" rx="1.25" fill="currentColor" opacity="0.3"/>
                            <rect x="14" y="32" width="26" height="2.5" rx="1.25" fill="currentColor" opacity="0.3"/>
                            <rect x="14" y="37" width="20" height="2.5" rx="1.25" fill="currentColor" opacity="0.3"/>
                            <rect x="14" y="42" width="23" height="2.5" rx="1.25" fill="currentColor" opacity="0.3"/>
                            {/* Slash */}
                            <line x1="9" y1="45" x2="45" y2="9" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round"/>
                        </svg>
                    </div>
                </div>
            </div>

            {/* ── Main hero container ── */}
            <div
                className={`vimeo-hero ${isPlaying ? 'is-playing' : 'is-paused'} ${isMuted ? 'is-muted' : 'is-unmuted'}`}
                ref={playerRef}
                onClick={toggleMute}
            >
                {/* ── Background layers (active while no video src) ── */}
                {/* Animated gradient orbs — also targeted by GSAP parallax */}
                <div className="vimeo-hero__orb vimeo-hero__orb--1" ref={orb1Ref} />
                <div className="vimeo-hero__orb vimeo-hero__orb--2" ref={orb2Ref} />
                <div className="vimeo-hero__orb vimeo-hero__orb--3" ref={orb3Ref} />

                {/* Subtle grid pattern */}
                <div className="vimeo-hero__grid" />

                {/* Film-grain texture */}
                <div className="vimeo-hero__grain" />

                {/* Video (hidden until src is provided) */}
                <video
                    ref={iframeRef}
                    // src="/your-personal-video.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="vimeo-hero__iframe"
                    style={{ objectFit: 'cover' }}
                />

                {/* Gradient fade */}
                <div className="vimeo-hero__fade" />

                {/* ── Floating info badges — magnetic via GSAP ── */}
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

                {/* ① Headline — bottom left, word-by-word layout */}
                <div className="home-header__title">
                    <h1 className="vimeo-hero__title" ref={titleRef} onClick={(e) => e.stopPropagation()}>

                        {/* "creative" */}
                        <span className="vimeo-hero__word">creative </span>

                        {/* "frontend" + smiley */}
                        <span className="vimeo-hero__word is--relative">
                            <span>frontend </span>
                            <div className="home-header__smiley">
                                <img
                                    src="/assets/VimeoHero SVG/smiley-face.svg"
                                    alt=""
                                    className="home-header__smiley-svg"
                                />
                            </div>
                        </span>

                        <div style={{ flexBasis: '100%', height: 0 }} />

                        {/* "react & next.js" italicized mini label before "developer" */}
                        <span className="vimeo-hero__word"><em>react/next.js </em></span>

                        {/* "developer" + pink star + underline */}
                        <span className="vimeo-hero__word is--relative">
                            <div className="home-header__star">
                                <div className="home-header__star-inner">
                                    <img
                                        src="/assets/VimeoHero SVG/pink-star.svg"
                                        alt=""
                                        className="home-header__star-svg"
                                    />
                                </div>
                            </div>
                            {/* Oval underline */}
                            <img
                                src="/assets/VimeoHero SVG/oval-underline.svg"
                                alt=""
                                className="home-header__title-line-svg"
                            />
                            <span>developer</span>
                        </span>

                    </h1>
                </div>

                {/* ① Controls — bottom LEFT: pause/play + fullscreen */}
                <div className="vimeo-hero__controls" ref={controlsRef} onClick={(e) => e.stopPropagation()}>


                    {/* Fullscreen */}
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

                {/* Loading spinner removed because native HTML video loads silently in background */}
            </div>
        </>
    );
}
