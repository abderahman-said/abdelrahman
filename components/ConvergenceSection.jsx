"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const ConvergenceSection = () => {
  const triggerRef = useRef(null);
  const wrapperRef = useRef(null);
  const manRef = useRef(null);
  const robotRef = useRef(null);
  const textsContainerRef = useRef(null);
  const finalTextRef = useRef(null);
  const canvasRef = useRef(null);
  const flashRef = useRef(null);
  const gradientOverlayRef = useRef(null);

  const phrases = ["المستقبل بعيد؟", "بالعكس.. أقرب مما تتخيل", "حنا نختصر المسافات..", "ونبني الجسر.."];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars = [];
    const numStars = 800;
    const speed = 3;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * width,
      });
    }

    let animationFrameId;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        star.z -= speed;
        if (star.z <= 0) {
          star.z = width;
          star.x = Math.random() * width - width / 2;
          star.y = Math.random() * height - height / 2;
        }

        const x = (star.x / star.z) * width + width / 2;
        const y = (star.y / star.z) * height + height / 2;
        const size = Math.max(0, (1 - star.z / width) * 3);

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, 1 - star.z / width)})`;
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=500%",
          scrub: 1.5,
          pin: true,
          snap: {
            snapTo: "labels",
            duration: { min: 0.2, max: 0.8 },
            delay: 0.1,
            ease: "power1.inOut",
          },
        },
      });

      // --- INITIAL STATES ---
      gsap.set(wrapperRef.current, { backgroundColor: "#ffffff" });
      gsap.set(canvasRef.current, { opacity: 0 });
      gsap.set(gradientOverlayRef.current, { opacity: 0 });
      gsap.set(manRef.current, { y: "-180%", rotation: 0, opacity: 0 });
      gsap.set(robotRef.current, { y: "180%", rotation: 0, opacity: 0 });

      // Handle Initial Text States
      const allTexts = textsContainerRef.current?.children;
      if (allTexts && allTexts.length > 0) {
        gsap.set(allTexts, { color: "#0A2463", opacity: 0, scale: 0.5, blur: 10 });
        gsap.set(allTexts[0], {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          color: "#0A2463",
          z: 0,
        });
      }

      // --- PHASE 0: THE TRANSITION (White to Space) ---
      tl.addLabel("start");

      const transitionDuration = 0.8;

      tl.to(
        wrapperRef.current,
        {
          backgroundColor: "#020617",
          duration: transitionDuration,
          ease: "power2.inOut",
        },
        0,
      );

      if (allTexts && allTexts[0]) {
        tl.to(
          allTexts[0],
          {
            color: "#ffffff",
            scale: 1.5,
            duration: transitionDuration,
            ease: "power2.inOut",
          },
          0,
        );
        tl.to(
          allTexts[0],
          {
            scale: 6,
            opacity: 0,
            filter: "blur(20px)",
            duration: 0.5,
            ease: "power1.in",
          },
          transitionDuration,
        );
      }

      tl.to(
        [canvasRef.current, gradientOverlayRef.current],
        {
          opacity: 0.8,
          duration: transitionDuration,
          ease: "power2.inOut",
        },
        0.2,
      );

      tl.addLabel("phase1");

      // --- PHASE 1: Text Tunnel & Approach ---
      const texts = gsap.utils.toArray(textsContainerRef.current?.children || []);
      const phaseOneStart = 1.0;

      texts.forEach((text, i) => {
        if (i === 0) return;

        const stepDuration = 1.8;
        const startTime = phaseOneStart + (i - 1) * stepDuration;

        gsap.set(text, { color: "#ffffff" });

        tl.fromTo(
          text,
          { scale: 0.2, opacity: 0, filter: "blur(10px)", z: -1000 },
          {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            z: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          startTime,
        )
          .addLabel(`text_${i}`)
          .to(text, { scale: 1.2, duration: 0.4 }, startTime + 0.8)
          .to(
            text,
            {
              scale: 6,
              opacity: 0,
              filter: "blur(20px)",
              duration: 0.8,
              ease: "power1.in",
            },
            startTime + 1.2,
          );

        tl.to(
          manRef.current,
          {
            y: `${-180 + (i + 1) * (165 / texts.length)}%`,
            rotation: i % 2 === 0 ? 3 : -3,
            duration: stepDuration,
            ease: "power1.inOut",
          },
          startTime,
        );

        tl.to(
          robotRef.current,
          {
            y: `${180 - (i + 1) * (165 / texts.length)}%`,
            rotation: i % 2 === 0 ? -3 : 3,
            duration: stepDuration,
            ease: "power1.inOut",
          },
          startTime,
        );

        if (i === 1) {
          tl.to([manRef.current, robotRef.current], { opacity: 1, duration: 1.0, ease: "power2.out" }, startTime);
        }
      });

      const contactTime = phaseOneStart + (texts.length - 1) * 1.8;
      tl.addLabel("contact_approach");

      const mm = gsap.matchMedia();

      // Desktop Animations (Large Screens)
      mm.add("(min-width: 1280px)", () => {
        tl.to(manRef.current, { y: "-15%", x: "4%", rotation: 0, duration: 1.5, ease: "power2.out" }, contactTime);
        tl.to(robotRef.current, { y: "15%", x: "-10%", rotation: 0, duration: 1.5, ease: "power2.out" }, contactTime);
      });

      // Mobile/Tablet Animations (Tablets & Mobile)
      mm.add("(max-width: 1279px)", () => {
        tl.to(manRef.current, { y: "-15%", x: "18%", rotation: 0, duration: 1.5, ease: "power2.out" }, contactTime);
        tl.to(robotRef.current, { y: "15%", x: "-22%", rotation: 0, duration: 1.5, ease: "power2.out" }, contactTime);
      });

      tl.fromTo(
        finalTextRef.current,
        { scale: 0.5, opacity: 0, filter: "blur(10px)" },
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "back.out(1.2)",
        },
        contactTime + 0.3,
      );

      tl.addLabel("final_text");

      tl.to(
        finalTextRef.current,
        {
          scale: 1.2,
          opacity: 0,
          filter: "blur(20px)",
          duration: 0.8,
          ease: "power2.in",
        },
        contactTime + 2.0,
      );

      const touchTime = contactTime + 2.5;
      const flashTime = touchTime + 0.8;

      mm.add("(min-width: 1280px)", () => {
        tl.to(manRef.current, { y: "20%", x: "4%", rotation: 0, duration: 1.2, ease: "power1.inOut" }, touchTime);
        tl.to(robotRef.current, { y: "-22%", x: "-10%", rotation: 0, duration: 1.2, ease: "power1.inOut" }, touchTime);
      });

      mm.add("(max-width: 1279px)", () => {
        tl.to(manRef.current, { y: "20%", x: "12%", rotation: 0, duration: 1.2, ease: "power1.inOut" }, touchTime);
        tl.to(robotRef.current, { y: "-22%", x: "-15%", rotation: 0, duration: 1.2, ease: "power1.inOut" }, touchTime);
      });

      tl.to(
        flashRef.current,
        {
          opacity: 1,
          duration: 0.8,
          ease: "power2.in",
        },
        flashTime,
      );

      tl.to(
        wrapperRef.current,
        {
          backgroundColor: "#ffffff",
          duration: 0.1,
        },
        flashTime + 0.5,
      );
      tl.to(
        [canvasRef.current, gradientOverlayRef.current],
        {
          opacity: 0,
          duration: 0.5,
        },
        flashTime + 0.5,
      );
      tl.set([manRef.current, robotRef.current], { opacity: 0 }, flashTime + 0.8);

      tl.addLabel("end");

      return () => mm.revert();
    },
    { scope: triggerRef },
  );

  return (
    <div ref={triggerRef} className="relative w-full h-screen overflow-hidden">
      <div ref={wrapperRef} className="absolute inset-0 bg-white z-0 transition-colors">
        <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-0" />
        <div
          ref={gradientOverlayRef}
          className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-blue-900/20 z-0 pointer-events-none mix-blend-screen opacity-0"
        />
      </div>

      <div
        ref={textsContainerRef}
        className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none perspective-1000"
      >
        {phrases.map((phrase, i) => (
          <h2
            key={i}
            className="absolute text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-black text-[#0A2463] text-center opacity-0 whitespace-nowrap drop-shadow-[0_0_20px_rgba(56,189,248,0.8)]"
          >
            {phrase}
          </h2>
        ))}
      </div>

      <div
        ref={manRef}
        className="absolute top-0 w-full h-[45vh] lg:h-[45vh] lg:max-h-[500px] xl:h-[50vh] xl:max-h-none flex flex-col justify-end items-center z-20 will-change-transform opacity-0"
      >
        <div className="relative w-80 md:w-96 lg:w-[500px] aspect-[3/4]">
          <Image
            src="/manupgoingdown.png"
            alt="Saudi Man"
            fill
            className="object-contain object-bottom drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      <div
        ref={robotRef}
        className="absolute bottom-0 w-full h-[45vh] lg:h-[45vh] lg:max-h-[500px] xl:h-[50vh] xl:max-h-none flex flex-col justify-start items-center z-20 will-change-transform opacity-0"
      >
        <div className="relative w-104 md:w-lg lg:w-[650px] aspect-[3/4]">
          <Image
            src="/robotdowngoingup.png"
            alt="Robot"
            fill
            className="object-contain object-top drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
        <h1
          id="final-text"
          ref={finalTextRef}
          className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-transparent pb-5 bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white opacity-0 drop-shadow-[0_0_40px_rgba(37,99,235,1)]"
        >
          صافح طموحك
        </h1>
      </div>

      <div ref={flashRef} className="absolute inset-0 bg-white opacity-0 z-50 pointer-events-none" />
    </div>
  );
};

export default ConvergenceSection;
