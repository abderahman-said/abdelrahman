'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CARDS_DATA } from '@/lib/data';

export default function ServiceCards() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Animate underline SVG paths on scroll (from HeroSection)
        gsap.to('.title-underline-svg path', {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: 'power3.out',
            stagger: 0.3,
            scrollTrigger: {
                trigger: '.service-cards-wrapper',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        });

        initCardAnimations();

        // Handle resize events for responsive behavior
        const handleResize = () => {
            ScrollTrigger.refresh();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <>
            <div className="title-container">
                <h2 className="main-title">hire me for <span className="italic-text">these:</span></h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="160" viewBox="0 0 159 17" fill="none" className="title-underline-svg">
                    <path d="M1 12.1515C53.0771 5.7187 105.529 2.30552 158 1.93652" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M30.2672 15.9461C64.1899 12.8158 98.2663 11.3583 132.33 11.5735" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
            </div>

            {/* ─── Service Cards ─── */}
            <div className="cards-wrapper service-cards-wrapper" id="cards-wrapper">
                {CARDS_DATA.map((card) => (
                    <div key={card.color} className={`card card-${card.color}`}>
                        <div className={`card-sticker sticker-${card.sticker}`}>
                            <img
                                src={`/assets/Card-Sticker SVG/sticker-${card.sticker}.svg`}
                                alt=""
                                width="100%"
                                loading="lazy"
                                aria-hidden="true"
                            />
                        </div>
                        <h3 className="card-title">{card.title}</h3>
                        <svg width="100%" height="10" className="card-divider-svg" aria-hidden="true">
                            <use href="#card-divider" />
                        </svg>
                        <ul className="card-list">
                            {card.services.map((service) => (
                                <li key={service}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="16" className="services-card__bullet-svg" aria-hidden="true">
                                        <use href="#bullet-icon" />
                                    </svg>
                                    {service}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    );
}

function initCardAnimations() {
    const cards = gsap.utils.toArray('.card');
    if (!cards.length) return;

    const originalData = [
        { rotation: 4 },
        { rotation: -5 },
        { rotation: 5 },
        { rotation: -8 },
        { rotation: 5 }
    ];

    // Enhanced mobile detection
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isTablet = window.matchMedia('(max-width: 1024px)').matches && !isMobile;
    let leaveTimeout = null;

    // Kill any existing ScrollTriggers before creating new ones
    ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === '.cards-wrapper' || trigger.vars.id === 'mobile-cards-pin') {
            trigger.kill();
        }
    });

    // Reset all cards to default state first
    gsap.set(cards, {
        clearProps: "all"
    });

    if (!isMobile && !isTablet) {
        // Desktop: Original hover animations
        cards.forEach((card, index) => {
            gsap.set(card, {
                position: 'absolute',
                left: card.classList.contains(`card-green`) ? 'calc(50% - 600px)' :
                      card.classList.contains(`card-darkblue`) ? 'calc(50% - 330px)' :
                      card.classList.contains(`card-orange`) ? 'calc(50% - 80px)' :
                      card.classList.contains(`card-maroon`) ? 'calc(50% + 180px)' :
                      card.classList.contains(`card-pink`) ? 'calc(50% + 320px)' : '50%',
                top: card.classList.contains(`card-green`) ? '50px' :
                     card.classList.contains(`card-darkblue`) ? '100px' :
                     card.classList.contains(`card-orange`) ? '20px' :
                     card.classList.contains(`card-maroon`) ? '30px' :
                     card.classList.contains(`card-pink`) ? '70px' : '0',
                rotation: originalData[index].rotation,
                zIndex: index + 1
            });

            card.addEventListener('mouseenter', () => {
                if (leaveTimeout) { clearTimeout(leaveTimeout); leaveTimeout = null; }
                const hoverGap = 120;
                const clusterGap = 150;
                const cardWidth = 320;
                const hoveredLeft = cards[index].offsetLeft;
                const leftCards = [];
                const rightCards = [];

                cards.forEach((otherCard, otherIndex) => {
                    if (otherIndex < index) leftCards.push({ card: otherCard, index: otherIndex });
                    else if (otherIndex > index) rightCards.push({ card: otherCard, index: otherIndex });
                });

                const currentTop = cards[index].offsetTop;
                const targetCommonTop = 50;
                const moveY = targetCommonTop - currentTop;

                gsap.to(cards[index], { x: 0, y: moveY, rotation: 0, scale: 1.08, duration: 0.9, ease: 'elastic.out(1, 0.5)', overwrite: true });

                if (rightCards.length) {
                    const clusterStart = hoveredLeft + cardWidth + hoverGap;
                    rightCards.forEach((item, i) => {
                        const targetAbsLeft = clusterStart + (i * clusterGap);
                        const targetX = Math.max(targetAbsLeft - item.card.offsetLeft, 10);
                        const angleRad = originalData[item.index].rotation * (Math.PI / 180);
                        const targetY = targetX * Math.tan(angleRad);
                        gsap.to(item.card, { x: targetX, y: targetY, rotation: originalData[item.index].rotation, scale: 1, duration: 1.0, ease: 'elastic.out(1, 0.5)', overwrite: true });
                    });
                }

                if (leftCards.length) {
                    leftCards.reverse();
                    const clusterStart = hoveredLeft - hoverGap - cardWidth;
                    leftCards.forEach((item, i) => {
                        const targetAbsLeft = clusterStart - (i * clusterGap);
                        const targetX = Math.min(targetAbsLeft - item.card.offsetLeft, -10);
                        const angleRad = originalData[item.index].rotation * (Math.PI / 180);
                        const targetY = targetX * Math.tan(angleRad);
                        gsap.to(item.card, { x: targetX, y: targetY, rotation: originalData[item.index].rotation, scale: 1, duration: 1.0, ease: 'elastic.out(1, 0.5)', overwrite: true });
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                leaveTimeout = setTimeout(() => {
                    cards.forEach((c, i) => {
                        gsap.to(c, { x: 0, y: 0, scale: 1, rotation: originalData[i].rotation, duration: 1.0, ease: 'elastic.out(1, 0.5)', overwrite: true, zIndex: i + 1 });
                    });
                }, 80);
            });
        });
    } else if (isTablet) {
        // Tablet: Simplified layout - stacked vertically
        const cardsWrapper = document.querySelector('.cards-wrapper');
        gsap.set(cardsWrapper, {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '30px',
            height: 'auto',
            position: 'relative'
        });

        cards.forEach((card, index) => {
            gsap.set(card, {
                position: 'relative',
                left: 'auto',
                top: 'auto',
                transform: 'none',
                rotation: 0,
                zIndex: 'auto',
                width: '90%',
                maxWidth: '400px',
                height: 'auto',
                minHeight: '400px',
                margin: '0'
            });
        });
    } else {
        // Mobile: Stacked card scroll reveal
        const cardsWrapper = document.querySelector('.cards-wrapper');
        const scrollPerCard = window.innerHeight * 0.8;
        const navH = 60;
        const mobileRotations = [-6, 4, -8, 5, -3];

        gsap.set(cardsWrapper, {
            display: 'block',
            height: 'auto',
            position: 'relative'
        });

        cards.forEach((card, i) => {
            gsap.set(card, {
                position: 'relative',
                left: 'auto',
                top: 'auto',
                transform: 'none',
                rotation: 0,
                zIndex: 'auto',
                width: '90%',
                maxWidth: '350px',
                height: 'auto',
                minHeight: '450px',
                margin: '0 auto 20px'
            });
        });
    }
}
