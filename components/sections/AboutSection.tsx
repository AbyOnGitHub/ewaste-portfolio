'use client';

import React, { useState } from 'react';
import { ShieldCheck, Recycle, Cpu, TreePine, Lightbulb, Brain, Zap } from 'lucide-react';
import { EWasteQuizModal } from '@/components/modals/EWasteQuizModal';

const focusAreas = [
  { name: 'Circular Electronics', icon: Recycle, color: 'text-emerald-400' },
  { name: 'E-Waste Heavy Metal Audit', icon: ShieldCheck, color: 'text-teal-400' },
  { name: 'Bio-Substrate Hardware', icon: Cpu, color: 'text-amber-400' },
  { name: 'Soil & Water Conservation', icon: TreePine, color: 'text-[#A7F3D0]' },
  { name: 'Modular Repair Blueprints', icon: Lightbulb, color: 'text-yellow-400' },
];

export function AboutSection() {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <section id="about" className="relative py-20 px-4 md:px-8 bg-[#f0f7f2] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-serif font-bold text-[#0f2b20] mb-8">Why sell E-waste?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-[#14532D] text-white rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Recycle className="w-6 h-6 text-[#A7F3D0]" />
              <h3 className="text-xl font-semibold">Environmental Impact</h3>
            </div>
            <p className="text-sm text-[#D1F7E6]">
              Recycling e-waste recovers valuable materials, reduces pollution, and lowers the need for mining new resources. Selling e-waste helps close the loop and protects ecosystems.
            </p>
          </div>

          <div className="p-8 bg-[#14532D] text-white rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-[#A7F3D0]" />
              <h3 className="text-xl font-semibold">Data Security</h3>
            </div>
            <p className="text-sm text-[#D1F7E6]">
              Properly handling and selling devices ensures sensitive data is securely erased and destroyed, reducing risks from discarded drives and devices.
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Quiz Card */}
          <div className="relative bg-white rounded-xl p-8 shadow-md overflow-hidden group">
            {/* Decorative background blob */}
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-[#A7F3D0]/20 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-[#14532D]/10 blur-2xl pointer-events-none" />

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14532D]/10 border border-[#14532D]/20 text-[#14532D] text-xs font-semibold mb-4">
              <Zap className="w-3 h-3" />
              Interactive Quiz
            </div>

            <h3 className="text-2xl font-bold text-[#0f2b20] mb-3 font-serif">Test Your E-Waste IQ</h3>
            <p className="text-sm text-[#234935] leading-relaxed mb-2">
              Think you know about e-waste? Take our 10-question challenge covering toxic metals, global recycling rates, regulations, and sustainability practices.
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-4 my-5">
              <div className="flex flex-col">
                <span className="text-xl font-black text-[#14532D]">10</span>
                <span className="text-xs text-[#234935]/70">Questions</span>
              </div>
              <div className="w-px h-8 bg-[#14532D]/15" />
              <div className="flex flex-col">
                <span className="text-xl font-black text-[#14532D]">MCQ</span>
                <span className="text-xs text-[#234935]/70">Format</span>
              </div>
              <div className="w-px h-8 bg-[#14532D]/15" />
              <div className="flex flex-col">
                <span className="text-xl font-black text-[#14532D]">5</span>
                <span className="text-xs text-[#234935]/70">Result Tiers</span>
              </div>
            </div>

            <button
              onClick={() => setQuizOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#14532D] text-white font-semibold text-sm hover:bg-[#1a6b3c] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 group-hover:bg-[#1f7a45]"
            >
              <Brain className="w-4 h-4" />
              Try Yourself
            </button>
          </div>

          <div className="rounded-xl overflow-hidden shadow-md">
            <img src="/textures/earth/earthmap.jpg" alt="decor" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      <EWasteQuizModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
    </section>
  );
}
