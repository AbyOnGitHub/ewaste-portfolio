'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Project } from '@/types/project';
import { Globe, Layers, Sparkles, Filter } from 'lucide-react';

// Dynamic import of EarthCanvas with ssr: false so 3D renders client-side only
const EarthCanvas = dynamic(
  () => import('../3d/EarthCanvas').then((mod) => mod.EarthCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[500px] bg-[#071c15]/60 rounded-3xl border border-[#87A96B]/20 backdrop-blur-md">
        <div className="w-12 h-12 border-2 border-[#A7F3D0] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-[#A7F3D0]">Initializing 3D Eco-Globe...</p>
      </div>
    ),
  }
);

interface EarthSectionProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
}

export function EarthSection({ projects, onOpenProject }: EarthSectionProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const sectionRef = useRef<HTMLDivElement>(null);

  // Register GSAP ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=100%',
          pin: false, // Smooth pin inside viewport
          scrub: true,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const filteredProjects = activeCategoryFilter === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategoryFilter);

  const handleSelectNode = (project: Project) => {
    setSelectedProject(project);
    onOpenProject(project);
  };

  const categories = ['All', 'Poster', 'PDF & Research', 'Prototype', 'Video & Reel', 'Certificate'];

  return (
    <section
      id="earth-globe"
      ref={sectionRef}
      className="relative w-full py-20 px-4 md:px-8 bg-gradient-to-b from-[#071c15] via-[#0b2b20] to-[#071c15] overflow-hidden"
    >
      {/* Background ambient lighting blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0E7490]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#87A96B]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-3xl mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14532D]/40 border border-[#87A96B]/30 text-xs font-semibold text-[#A7F3D0] tracking-wider uppercase">
            <Globe className="w-3.5 h-3.5" />
            <span>Interactive 3D Centerpiece</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#F5F3EA] tracking-tight">
            Global Impact <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A7F3D0] via-[#87A96B] to-[#0E7490]">Node Map</span>
          </h2>

          <p className="text-base md:text-lg text-[#D1CDBC]">
            Each glowing node represents an e-waste assignment, poster, or prototype project pinned across the globe. Rotate the Earth to discover sustainable tech initiatives.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  activeCategoryFilter === cat
                    ? 'bg-[#87A96B] text-[#071c15] shadow-lg font-semibold glow-mint'
                    : 'bg-[#0b2b20]/80 text-[#D1CDBC] hover:bg-[#123d2e] border border-[#87A96B]/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Earth Canvas View Container */}
        <div className="relative w-full h-[600px] max-w-5xl rounded-3xl overflow-hidden glass-panel border border-[#87A96B]/30 shadow-2xl">
          <EarthCanvas
            projects={filteredProjects}
            selectedProject={selectedProject}
            onSelectProject={handleSelectNode}
          />
        </div>
      </div>
    </section>
  );
}
