'use client';

import React from 'react';
import { Video, Film, Sparkles } from 'lucide-react';
import { Attachment } from '@/types/project';

interface VideoReelPlayerProps {
  attachment: Attachment;
}

export function VideoReelPlayer({ attachment }: VideoReelPlayerProps) {
  const isVerticalReel = attachment.type === 'reel' || attachment.aspectRatio === '9:16';

  return (
    <div className="space-y-4 flex flex-col items-center">
      {/* Top Title Bar */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 bg-[#0b2b20] rounded-xl border border-[#87A96B]/20 text-xs text-[#D1CDBC]">
        <div className="flex items-center gap-2 truncate">
          {isVerticalReel ? (
            <Film className="w-4 h-4 text-pink-400 shrink-0" />
          ) : (
            <Video className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span className="font-medium text-[#F5F3EA] truncate">
            {attachment.title || (isVerticalReel ? '9:16 Social Awareness Reel' : 'Video Documentary')}
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-[#14532D] text-[11px] text-[#A7F3D0] font-mono">
          {isVerticalReel ? '9:16 Vertical' : '16:9 Widescreen'}
        </span>
      </div>

      {/* Responsive Video Container */}
      <div
        className={`relative rounded-3xl overflow-hidden bg-[#041611] border-2 border-[#87A96B]/30 shadow-2xl ${
          isVerticalReel
            ? 'w-[300px] h-[533px] sm:w-[340px] sm:h-[604px]' // 9:16 Aspect ratio box
            : 'w-full h-[380px] sm:h-[480px] md:h-[540px]' // 16:9 Aspect ratio box
        }`}
      >
        <video
          src={attachment.url}
          controls
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
          poster={attachment.thumbnailUrl}
        >
          Your browser does not support HTML5 video tag playback.
        </video>
      </div>

      {attachment.description && (
        <p className="text-xs text-[#D1CDBC] max-w-lg text-center leading-relaxed">
          {attachment.description}
        </p>
      )}
    </div>
  );
}
