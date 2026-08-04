'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowDown, Leaf, Sparkles, ChevronDown } from 'lucide-react';

const quotes = [
  "\"Electronic waste isn't trash — it's raw potential waiting for sustainable rebirth.\"",
  "\"Tech and nature aren't rivals; they are the ultimate balance when designed with intention.\"",
  "\"The future of innovation is non-toxic, modular, and infinitely circular.\"",
];

export function HeroSection() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [typedQuote, setTypedQuote] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Typing effect for sustainability quotes
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const targetQuote = quotes[currentQuoteIndex];

    if (typedQuote.length < targetQuote.length) {
      timeoutId = setTimeout(() => {
        setTypedQuote(targetQuote.slice(0, typedQuote.length + 1));
      }, 45);
    } else {
      timeoutId = setTimeout(() => {
        setTypedQuote('');
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
      }, 4000);
    }

    return () => clearTimeout(timeoutId);
  }, [typedQuote, currentQuoteIndex]);

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 40, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, delay: 0.3 }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 1.0 },
          '-=0.8'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.8 },
          '-=0.6'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Ambient Bioluminescent Particle Drift Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.2,
      alpha: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? '#A7F3D0' : '#87A96B',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center px-4 md:px-8 pt-20 pb-16 overflow-hidden bg-gradient-to-b from-[#e9f2ec] via-[#dff1e4] to-[#e9f2ec]"
    >
      {/* Background Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Decorative Organic Gradient Blobs */}
      <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-[#0E7490]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-[#4C7C59]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
          {/* Left text column */}
          <div className="lg:col-span-7 p-6 md:p-12">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#e6f6ef] border border-[#cfead7] text-sm text-[#14532D] font-semibold mb-6">
              <Leaf className="w-4 h-4 text-[#14532D]" />
              Transforming E-waste into Environmental Impact
            </div>

            <h1 ref={titleRef} className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-[#0f2b20] leading-tight mb-4">
              Hi, I&apos;m Abedan Biswal
            </h1>

            <p ref={subtitleRef} className="text-lg md:text-xl text-[#234935] max-w-2xl mb-3">
              Student at <strong className="text-[#14532D]">Vidyalankar Institute of Technology</strong>
            </p>

            <p className="text-base md:text-lg text-[#234935] max-w-2xl mb-6">
              I research and prototype circular electronics, visualize assignments, and advocate for repairable, low-waste hardware.
            </p>

            <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
              <a href="#projects-grid" className="px-6 py-3 rounded-full bg-[#F59E0B] text-white font-semibold shadow-md hover:brightness-95 transition">
                Explore More
              </a>
              <a href="#contact" className="px-6 py-3 rounded-full bg-transparent border border-[#14532D] text-[#14532D] font-medium hover:bg-[#14532D] hover:text-white transition">
                Contact Me
              </a>
            </div>
          </div>

          {/* Right image column (profile) */}
          <div className="lg:col-span-5 p-6 flex justify-center">
            <div className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden bg-white flex items-center justify-center p-6">
              <img
                src="https://media.licdn.com/dms/image/v2/D4D03AQF3ZOsqgILt2A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1727025241055?e=1787184000&v=beta&t=XBll9FQEvC4FnyvNZcum7JFPi4BVM5pa3jJiypc7-WU"
                alt="Abedan Biswal"
                className="w-48 h-48 rounded-full object-cover border-4 border-[#e6f6ef] shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-sm text-[#0f2b20] hover:text-[#14532D] transition-colors">
        <span className="font-medium">Scroll to Explore</span>
        <ChevronDown className="w-5 h-5 animate-bounce text-[#14532D]" />
      </a>
    </section>
  );
}
