'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../app/styles/horizontal-words.css';

gsap.registerPlugin(ScrollTrigger);

const HorizontalWords = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const container = sectionRef.current;
            const textRef = container.querySelector('.horizontal-words__relative');
            const letters = container.querySelectorAll('.letter');

            // Select the individual stickers
            const stickers = container.querySelectorAll('.horizontal-words__sticker-watch, .horizontal-words__sticker-cursor, .horizontal-words__sticker-phone');
            const arrows = container.querySelectorAll('.horizontal-words__arrow-svg path, .horizontal-words__arrow-end-svg path');

            // --- RESPONSIVE SETTINGS ---
            const isMobile = window.innerWidth <= 768;
            const entranceDistance = isMobile ? window.innerHeight * 0.5 : window.innerHeight;
            const pinnedDistance = isMobile ? 1500 : 2500;

            // --- ENTRANCE & PINNING LOGIC ---
            const scrollTween = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: "top bottom",
                    end: () => `+=${entranceDistance + pinnedDistance}`,
                    scrub: 1,
                    invalidateOnRefresh: true,
                }
            });

            // Mobile: smaller horizontal movement, Desktop: full movement
            const startX = isMobile ? window.innerWidth * 0.3 : window.innerWidth;
            const midX = isMobile ? window.innerWidth * 0.2 : window.innerWidth * 0.5;
            
            scrollTween
                .fromTo(textRef, {
                    x: startX
                }, {
                    x: midX,
                    ease: "none",
                    duration: entranceDistance
                })
                .to(textRef, {
                    x: () => isMobile ? 
                        -(textRef.scrollWidth * 0.6) : // Mobile: less scroll distance
                        -(textRef.scrollWidth - window.innerWidth * 0.5), // Desktop: full distance
                    ease: "none",
                    duration: pinnedDistance
                });

            // Pinning - shorter on mobile
            ScrollTrigger.create({
                trigger: container,
                start: "top top",
                end: () => `+=${pinnedDistance}`,
                pin: true,
                pinSpacing: true,
                invalidateOnRefresh: true
            });
            // ------------------------------------

            // Bounce each letter - reduced movement on mobile
            letters.forEach((letter) => {
                const bounceIntensity = isMobile ? 200 : 500;
                const rotationIntensity = isMobile ? 30 : 60;
                
                gsap.from(letter, {
                    yPercent: (Math.random() - 0.5) * bounceIntensity,
                    rotation: (Math.random() - 0.5) * rotationIntensity,
                    ease: "elastic.out(1.2, 1)",
                    scrollTrigger: {
                        trigger: letter,
                        containerAnimation: scrollTween,
                        start: 'left 90%',
                        end: 'left 50%',
                        scrub: 0.5
                    }
                });
            });

            // Bounce stickers - smaller scale on mobile
            stickers.forEach((sticker) => {
                const bounceIntensity = isMobile ? 200 : 400;
                const rotationIntensity = isMobile ? 30 : 60;
                
                gsap.from(sticker, {
                    scale: 0,
                    yPercent: (Math.random() - 0.5) * bounceIntensity,
                    rotation: (Math.random() - 0.5) * rotationIntensity,
                    ease: "elastic.out(1.2, 1)",
                    scrollTrigger: {
                        trigger: sticker,
                        containerAnimation: scrollTween,
                        start: 'left 90%',
                        end: 'left 50%',
                        scrub: 0.5
                    }
                });
            });

            // Animate Drawing SVG Arrows 
            arrows.forEach((arrowPath) => {
                if (arrowPath.getTotalLength) {
                    const pathLen = arrowPath.getTotalLength();
                    gsap.set(arrowPath, { strokeDasharray: pathLen, strokeDashoffset: pathLen });
                    gsap.to(arrowPath, {
                        strokeDashoffset: 0,
                        duration: 1,
                        scrollTrigger: {
                            trigger: arrowPath.parentElement,
                            containerAnimation: scrollTween,
                            start: 'left 90%',
                            end: 'left 50%', // This is the last arrow's end point
                            scrub: 0.5
                        }
                    });
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="horizontal-words-section content-section">
            <div className="horizontal-words__relative">
                <div className="horizontal-words__sticker-svg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 386 127" fill="none" className="horizontal-words__arrow-svg"><path d="M2 123C9 35.9999 84.5 17 124 25.9999C217.764 47.3635 207 115 177.5 123C105.777 142.45 110.737 1.99991 232.5 2C310.5 2.00006 366.5 79 376 118L356.5 105.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" ></path><path d="M2 123C9 35.9999 84.5 17 124 25.9999C217.764 47.3635 207 115 177.5 123C105.777 142.45 110.737 1.99991 232.5 2C310.5 2.00006 366.5 79 376 118L384 97" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" ></path></svg>
                    <img src="/assets/HorizontalWords SVG/horizontal-words-sticker-thumps-up.svg" className="horizontal-words__sticker-watch" alt="thumbs up sticker" />
                    <img src="/assets/HorizontalWords SVG/horizontal-words-sticker-cursor.svg" className="horizontal-words__sticker-cursor" alt="cursor sticker" />
                    <img src="/assets/HorizontalWords SVG/horizontal-words-sticker-phone.svg" className="horizontal-words__sticker-phone" alt="phone sticker" />
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 140 127" fill="none" className="horizontal-words__arrow-end-svg"><path d="M2.03125 2.42188C100.469 2.42188 130.156 52.4219 118.437 125.078L99.6875 107.891" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" ></path><path d="M2.03125 2.42188C100.469 2.42188 130.156 52.4219 118.438 125.078L137.969 110.234" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" ></path></svg>

                    <h2 className="display horizontal-words__h2" aria-label="I love building amazing web experiences">
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>I</div>
                        {" "}
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>l</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>o</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>v</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>e</div>
                        {" "}
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>b</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>u</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>i</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>l</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>d</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>i</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>n</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>g</div>
                        {" "}
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>a</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>m</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>a</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>z</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>i</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>n</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>g</div>
                        {" "}
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>w</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>e</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>b</div>
                        {" "}
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>e</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>x</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>p</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>e</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>r</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>i</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>e</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>n</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>c</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>e</div>
                        <div className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>s</div>
                    </h2>
                </div>
            </div>

            <div className="horizontal-words__bottom-text">
                <div className="horizontal-words__bottom-text-l">
                    I am a passionate frontend developer dedicated to pushing the boundaries<br />
                    of web design. By blending creative aesthetics with clean, efficient code,<br />
                    I build digital experiences that leave a lasting impression.
                </div>
            </div>
        </section>
    );
};

export default HorizontalWords;
