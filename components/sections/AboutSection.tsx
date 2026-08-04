'use client';

import React from 'react';
import { ShieldCheck, Recycle, Cpu, TreePine, Lightbulb } from 'lucide-react';

const focusAreas = [
  { name: 'Circular Electronics', icon: Recycle, color: 'text-emerald-400' },
  { name: 'E-Waste Heavy Metal Audit', icon: ShieldCheck, color: 'text-teal-400' },
  { name: 'Bio-Substrate Hardware', icon: Cpu, color: 'text-amber-400' },
  { name: 'Soil & Water Conservation', icon: TreePine, color: 'text-[#A7F3D0]' },
  { name: 'Modular Repair Blueprints', icon: Lightbulb, color: 'text-yellow-400' },
];

export function AboutSection() {
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
          <div className="bg-white rounded-xl p-8 shadow-md">
            <h3 className="text-2xl font-semibold text-[#0f2b20] mb-4">Title One</h3>
            <p className="text-[#234935]">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
            <div className="mt-6">
              <a href="#projects-grid" className="inline-block px-6 py-3 rounded-full bg-[#14532D] text-white font-semibold">Try Yourself</a>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden shadow-md">
            <img src="/textures/earth/earthmap.jpg" alt="decor" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
