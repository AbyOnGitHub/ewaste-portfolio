'use client';

import React from 'react';
import Image from 'next/image';
import { Award, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import { Attachment } from '@/types/project';

interface CertificateViewerProps {
  attachment: Attachment;
}

export function CertificateViewer({ attachment }: CertificateViewerProps) {
  return (
    <div className="space-y-6">
      {/* Framed Certificate Card */}
      <div className="relative w-full p-6 md:p-10 rounded-3xl bg-gradient-to-br from-[#0b2b20] via-[#071c15] to-[#123d2e] border-2 border-[#D4A373]/40 shadow-2xl space-y-6">
        {/* Top Gold Accreditation Header */}
        <div className="flex items-center justify-between border-b border-[#D4A373]/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#D4A373]/20 border border-[#D4A373]">
              <Award className="w-6 h-6 text-[#D4A373]" />
            </div>
            <div>
              <h4 className="text-lg font-serif font-bold text-[#F5F3EA]">
                {attachment.title || 'Official Certification Credential'}
              </h4>
              <p className="text-xs text-[#D4A373] font-mono">Verified Eco-Accreditation Standard</p>
            </div>
          </div>
          <ShieldCheck className="w-8 h-8 text-[#A7F3D0] opacity-80" />
        </div>

        {/* Certificate Image Frame */}
        <div className="relative w-full h-[380px] md:h-[480px] rounded-2xl overflow-hidden bg-[#041611] border border-[#87A96B]/30 shadow-inner">
          <Image
            src={attachment.url}
            alt={attachment.title || 'Certificate Image'}
            fill
            sizes="100vw"
            className="object-contain p-4"
          />
        </div>

        {/* Description & Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-[#D1CDBC] max-w-lg">
            {attachment.description || 'Recognized credential validating mastery in circular hardware standards and eco-design.'}
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={attachment.url}
              target="_blank"
              download
              className="px-4 py-2 rounded-full bg-[#D4A373] text-[#071c15] font-semibold text-xs hover:bg-[#A7F3D0] transition-colors flex items-center gap-1.5 shadow-lg"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save Certificate</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
