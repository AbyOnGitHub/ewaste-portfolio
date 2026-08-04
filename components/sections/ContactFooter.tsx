'use client';

import React, { useState } from 'react';
import { Mail, Send, Sparkles, Heart, CheckCircle, Globe, Share2 } from 'lucide-react';


export function ContactFooter() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <footer id="contact" className="relative bg-[#041611] pt-20 pb-12 px-4 md:px-8 border-t border-[#87A96B]/20 overflow-hidden">
      {/* Decorative Organic Wave / Circuit SVG Top Divider */}
      <div className="absolute top-0 left-0 right-0 h-8 pointer-events-none opacity-25">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full fill-[#87A96B]">
          <path d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,40 L1200,0 L0,0 Z" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto space-y-16">
        {/* Contact Form & Call to Action Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center glass-panel rounded-3xl p-8 md:p-12 border border-[#87A96B]/30 shadow-2xl">
          {/* Left Column: Heading & Info */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14532D]/40 border border-[#87A96B]/30 text-xs font-semibold text-[#A7F3D0] tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get In Touch</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#F5F3EA] leading-tight">
              Collaborate on <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A7F3D0] to-[#87A96B]">
                Sustainable Tech Solutions
              </span>
            </h2>

            <p className="text-sm md:text-base text-[#D1CDBC] leading-relaxed">
              Have questions about e-waste research, interested in featuring an assignment poster, or want to collaborate on a hardware upcycling campaign? Send a message below.
            </p>

            {/* Direct Email & Social Links */}
            <div className="space-y-3 pt-2">
                <a
                  href="mailto:abybswl07@gmail.com"
                  className="inline-flex items-center gap-2.5 text-sm text-[#A7F3D0] hover:text-[#87A96B] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>abybswl07@gmail.com</span>
                </a>

              <div className="flex items-center gap-4 pt-2">
                <a
                  href="https://github.com/AbyOnGitHub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-[#0b2b20] border border-[#87A96B]/30 text-[#D1CDBC] hover:text-[#A7F3D0] hover:border-[#A7F3D0] transition-all"
                  aria-label="GitHub"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/abedan-biswal-97b00032b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-[#0b2b20] border border-[#87A96B]/30 text-[#D1CDBC] hover:text-[#A7F3D0] hover:border-[#A7F3D0] transition-all"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Closing Bar */}
        <div className="pt-8 border-t border-[#87A96B]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D1CDBC]/70">
          <div className="flex items-center gap-1.5 text-[#A7F3D0]">
            <span>Made with intention for a cleaner planet</span>
            <Heart className="w-3.5 h-3.5 fill-[#A7F3D0] text-[#A7F3D0]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
