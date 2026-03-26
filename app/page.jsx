'use client';

import SvgSymbols from '@/components/SvgSymbols';
import Navbar from '@/components/Navbar';
import VimeoHero from '@/components/VimeoHero';
import ServiceCards from '@/components/ServiceCards';
import MotionCards from '@/components/MotionCards';
import DoubleMarquee from '@/components/DoubleMarquee';
import Footer from '@/components/Footer';
import TransitionScribble from '@/components/TransitionScribble';
import CursorBubble from '@/components/CursorBubble';
import SmoothScroll from '@/components/SmoothScroll';
import CrossedBanners from '@/components/CrossedBanners';

import HorizontalWords from '@/components/HorizontalWords';
import ProjectsSection from '@/components/ProjectsSection';
import GSAPCardGrid from '@/components/GSAPCardGrid';

export default function Home() {
    return (
        <>
            <SvgSymbols />
            <SmoothScroll />
            <CursorBubble />
            <header className="main-header">
                <Navbar />
                <VimeoHero />
            </header>
            <HorizontalWords />
            <main>
                <ProjectsSection />
                <div className="content-section motion-cards-wrapper">
                    <MotionCards />
                </div>
                <CrossedBanners />
                <GSAPCardGrid />
                <div className="content-section service-cards-wrapper">
                    <ServiceCards />
                </div>
            </main>
            {/* <section className="Double-marquee">
                <DoubleMarquee />
            </section> */}
            <footer className="main-footer">
                <Footer />
            </footer>
            <TransitionScribble />
        </>
    );
}
