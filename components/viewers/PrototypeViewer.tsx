'use client';

import React, { useState } from 'react';
import { ExternalLink, Play, Code, Globe, RefreshCw } from 'lucide-react';
import { Attachment } from '@/types/project';

interface PrototypeViewerProps {
  attachment: Attachment;
}

export function PrototypeViewer({ attachment }: PrototypeViewerProps) {
  const [key, setKey] = useState(0);

  const embedTarget = attachment.embedUrl || attachment.url;

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0b2b20] rounded-xl border border-[#87A96B]/20 text-xs text-[#D1CDBC]">
        <div className="flex items-center gap-2 truncate">
          <Code className="w-4 h-4 text-[#D4A373] shrink-0" />
          <span className="font-medium text-[#F5F3EA] truncate">{attachment.title || 'Interactive Web Sandbox'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setKey((k) => k + 1)}
            className="p-1.5 rounded-lg bg-[#071c15] text-[#D1CDBC] hover:text-[#A7F3D0] transition-colors"
            title="Reload Sandbox Frame"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <a
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg bg-[#D4A373] text-[#071c15] hover:bg-[#A7F3D0] transition-colors font-semibold flex items-center gap-1.5 text-xs shadow-md"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Live Prototype</span>
          </a>
        </div>
      </div>

      {/* Embedded Iframe Preview */}
      <div className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden bg-[#041611] border border-[#87A96B]/30 shadow-2xl">
        <iframe
          key={key}
          src={embedTarget}
          title={attachment.title || 'Prototype Preview Sandbox'}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          loading="lazy"
        />
      </div>

      <p className="text-xs text-[#D1CDBC]/70 text-center">
        Note: Some external websites or Figma frames enforce X-Frame-Options security policies. If the embed does not render above, click <strong className="text-[#A7F3D0]">"Open Live Prototype"</strong> to view in a dedicated browser window.
      </p>
    </div>
  );
}
