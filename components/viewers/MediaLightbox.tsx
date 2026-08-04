'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ZoomIn, ZoomOut, Download, ExternalLink, Maximize2 } from 'lucide-react';
import { Attachment } from '@/types/project';

interface MediaLightboxProps {
  attachment: Attachment;
}

export function MediaLightbox({ attachment }: MediaLightboxProps) {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));

  return (
    <div className="space-y-4">
      {/* Lightbox Controls Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0b2b20] rounded-xl border border-[#87A96B]/20 text-xs text-[#D1CDBC]">
        <span className="font-medium text-[#F5F3EA] truncate">{attachment.title || 'Poster Preview'}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg bg-[#071c15] hover:text-[#A7F3D0] transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-[11px] min-w-[40px] text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg bg-[#071c15] hover:text-[#A7F3D0] transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <a
            href={attachment.url}
            target="_blank"
            download
            className="p-1.5 rounded-lg bg-[#14532D] text-[#A7F3D0] hover:bg-[#87A96B] hover:text-[#071c15] transition-colors flex items-center gap-1 ml-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold">Download</span>
          </a>
        </div>
      </div>

      {/* Image Preview Container */}
      <div className="relative w-full h-[450px] md:h-[550px] rounded-2xl overflow-hidden bg-[#041611] border border-[#87A96B]/30 flex items-center justify-center">
        <div
          className="relative w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom})` }}
        >
          {attachment.url.startsWith('blob:') || attachment.url.startsWith('data:') ? (
            <img
              src={attachment.url}
              alt={attachment.title || 'High-res image preview'}
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <Image
              src={attachment.url}
              alt={attachment.title || 'High-res image preview'}
              fill
              sizes="100vw"
              className="object-contain p-2"
            />
          )}
        </div>
      </div>
    </div>
  );
}
