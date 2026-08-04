'use client';

import React from 'react';
import { Download, FileText, ExternalLink } from 'lucide-react';
import { Attachment } from '@/types/project';

interface PdfViewerProps {
  attachment: Attachment;
}

export function PdfViewer({ attachment }: PdfViewerProps) {
  return (
    <div className="space-y-4">
      {/* Top Header Controls Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0b2b20] rounded-xl border border-[#87A96B]/20 text-xs text-[#D1CDBC]">
        <div className="flex items-center gap-2 truncate">
          <FileText className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="font-medium text-[#F5F3EA] truncate">{attachment.title || 'PDF Whitepaper'}</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-[#071c15] text-[#D1CDBC] hover:text-[#A7F3D0] transition-colors flex items-center gap-1.5 text-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Tab</span>
          </a>
          <a
            href={attachment.url}
            download
            className="px-3 py-1.5 rounded-lg bg-[#14532D] text-[#A7F3D0] hover:bg-[#87A96B] hover:text-[#071c15] transition-colors font-semibold flex items-center gap-1.5 text-xs shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </a>
        </div>
      </div>

      {/* Embedded PDF Viewer */}
      <div className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden bg-[#041611] border border-[#87A96B]/30 shadow-inner">
        <object
          data={attachment.url}
          type="application/pdf"
          className="w-full h-full"
        >
          <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
            <FileText className="w-12 h-12 text-sky-400 animate-pulse" />
            <h4 className="text-base font-semibold text-[#F5F3EA]">PDF Preview Available</h4>
            <p className="text-xs text-[#D1CDBC] max-w-md">
              Your browser may block embedded PDF rendering. Click below to download or view in a new window.
            </p>
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#87A96B] text-[#071c15] font-semibold text-xs hover:bg-[#A7F3D0] transition-colors"
            >
              Open Full PDF Document
            </a>
          </div>
        </object>
      </div>
    </div>
  );
}
