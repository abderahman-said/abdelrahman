'use client';

import SvgSymbols from '@/components/SvgSymbols';
import Navbar from '@/components/Navbar';
import VimeoHero from '@/components/VimeoHero';
import { lazy, Suspense } from 'react';

const ServiceCards = lazy(() => import('@/components/ServiceCards'));
const MotionCards = lazy(() => import('@/components/MotionCards'));
const DoubleMarquee = lazy(() => import('@/components/DoubleMarquee'));
const Footer = lazy(() => import('@/components/Footer'));
const TransitionScribble = lazy(() => import('@/components/TransitionScribble'));
const CursorBubble = lazy(() => import('@/components/CursorBubble'));
const SmoothScroll = lazy(() => import('@/components/SmoothScroll'));
const CrossedBanners = lazy(() => import('@/components/CrossedBanners'));
const HorizontalWords = lazy(() => import('@/components/HorizontalWords'));
const ProjectsSection = lazy(() => import('@/components/ProjectsSection'));
const GSAPCardGrid = lazy(() => import('@/components/GSAPCardGrid'));

export default function Home() {
    return (
        <>
            <SvgSymbols />
            <Suspense fallback={null}>
                <SmoothScroll />
            </Suspense>
            <Suspense fallback={null}>
                <CursorBubble />
            </Suspense>
            <header className="main-header">
                <Navbar />
                <VimeoHero />
            </header>
            <Suspense fallback={null}>
                <HorizontalWords />
            </Suspense>
            <main>
                <Suspense fallback={null}>
                    <ProjectsSection />
                </Suspense>
                <div className="content-section motion-cards-wrapper">
                    <Suspense fallback={null}>
                        <MotionCards />
                    </Suspense>
                </div>
                <Suspense fallback={null}>
                    <CrossedBanners />
                </Suspense>
                <Suspense fallback={null}>
                    <GSAPCardGrid />
                </Suspense>
                <div className="content-section service-cards-wrapper">
                    <Suspense fallback={null}>
                        <ServiceCards />
                    </Suspense>
                </div>
            </main>
            <footer className="main-footer">
                <Suspense fallback={null}>
                    <Footer />
                </Suspense>
            </footer>
            <Suspense fallback={null}>
                <TransitionScribble />
            </Suspense>
        </>
    );
}
