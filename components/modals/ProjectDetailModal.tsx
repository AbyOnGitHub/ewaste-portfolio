'use client';

import React, { useState, useEffect } from 'react';
import { Project, Attachment } from '@/types/project';
import { X, Calendar, MapPin, FileText, Image as ImageIcon, Video, Award, Code, Layers } from 'lucide-react';
import { MediaLightbox } from '../viewers/MediaLightbox';
import { PdfViewer } from '../viewers/PdfViewer';
import { CertificateViewer } from '../viewers/CertificateViewer';
import { PrototypeViewer } from '../viewers/PrototypeViewer';
import { VideoReelPlayer } from '../viewers/VideoReelPlayer';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onDeleteAttachment: (slug: string, attachmentId: string) => void;
}

export function ProjectDetailModal({ project, onClose, onDeleteAttachment }: ProjectDetailModalProps) {
  const [activeAttachmentIndex, setActiveAttachmentIndex] = useState(0);

  useEffect(() => {
    setActiveAttachmentIndex(0);
  }, [project]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [project]);

  if (!project) return null;

  const currentAttachment: Attachment | undefined = project.attachments[activeAttachmentIndex];

  const renderAttachmentViewer = (att?: Attachment) => {
    if (!att) {
      return (
        <div className="rounded-3xl border border-dashed border-[#87A96B]/40 bg-[#071c15]/60 p-10 text-center text-sm text-[#D1CDBC]">
          No attachments yet. Upload files from the assignment card to preview them here.
        </div>
      );
    }
    switch (att.type) {
      case 'image':
        return <MediaLightbox attachment={att} />;
      case 'pdf':
      case 'document':
        return <PdfViewer attachment={att} />;
      case 'certificate':
        return <CertificateViewer attachment={att} />;
      case 'prototype':
      case 'website_preview':
      case 'referral':
        return <PrototypeViewer attachment={att} />;
      case 'video':
      case 'reel':
        return <VideoReelPlayer attachment={att} />;
      default:
        return <MediaLightbox attachment={att} />;
    }
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-3.5 h-3.5" />;
      case 'pdf':
      case 'document':
        return <FileText className="w-3.5 h-3.5" />;
      case 'certificate':
        return <Award className="w-3.5 h-3.5 text-yellow-400" />;
      case 'prototype':
      case 'website_preview':
        return <Code className="w-3.5 h-3.5 text-[#D4A373]" />;
      case 'video':
      case 'reel':
        return <Video className="w-3.5 h-3.5 text-pink-400" />;
      default:
        return <Layers className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#041611]/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#071c15] rounded-3xl border border-[#87A96B]/30 shadow-2xl overflow-y-auto flex flex-col">
        {/* Modal Sticky Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#0b2b20]/95 backdrop-blur-md border-b border-[#87A96B]/20">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#14532D] text-xs font-semibold text-[#A7F3D0] border border-[#A7F3D0]/30">
              {project.category === 'Others' && project.customCategory
                ? `Others: ${project.customCategory}`
                : project.category}
            </span>
            <div className="flex items-center gap-2 text-xs text-[#D1CDBC]">
              <Calendar className="w-3.5 h-3.5 text-[#87A96B]" />
              <span>{project.date}</span>
              <span className="mx-1">•</span>
              <MapPin className="w-3.5 h-3.5 text-[#87A96B]" />
              <span>{project.location.regionName}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#071c15] text-[#D1CDBC] hover:text-[#A7F3D0] hover:bg-[#123d2e] transition-all"
            aria-label="Close Project Detail Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-10 space-y-8">
          {/* Project Title & Subtitle */}
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#F5F3EA]">
              {project.title}
            </h2>
            <p className="text-base font-medium text-[#87A96B]">{project.subtitle}</p>
            <p className="text-sm text-[#D1CDBC] leading-relaxed max-w-3xl">
              {project.longDescription || project.description}
            </p>
          </div>

          {/* Impact Stats Grid (if available) */}
          {project.impactStats && project.impactStats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {project.impactStats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#0b2b20] border border-[#87A96B]/25 flex flex-col"
                >
                  <span className="text-xl sm:text-2xl font-serif font-bold text-[#A7F3D0]">
                    {stat.value}
                  </span>
                  <span className="text-xs text-[#D1CDBC]/80">{stat.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Attachment Selector Tabs */}
          <div className="space-y-4 pt-4 border-t border-[#87A96B]/20">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-widest text-[#87A96B] font-semibold">
                Project Media & Deliverables ({project.attachments.length})
              </h3>
            </div>

            {project.attachments.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {project.attachments.map((att, idx) => (
                    <button
                      key={att.id || idx}
                      onClick={() => setActiveAttachmentIndex(idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                        activeAttachmentIndex === idx
                          ? 'bg-[#87A96B] text-[#071c15] font-semibold glow-mint shadow-md'
                          : 'bg-[#0b2b20] text-[#D1CDBC] hover:bg-[#123d2e] border border-[#87A96B]/20'
                      }`}
                    >
                      {getAttachmentIcon(att.type)}
                      <span>{att.title || `Attachment ${idx + 1}`}</span>
                    </button>
                  ))}
                </div>

                {/* Active Attachment Viewer */}
                <div className="pt-2">
                  {renderAttachmentViewer(currentAttachment)}
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <span className="text-xs text-[#D1CDBC]/80">Manage attachments</span>
                  <button
                    type="button"
                    onClick={() => currentAttachment && onDeleteAttachment(project.slug, currentAttachment.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7f1d1d] text-xs font-semibold text-[#F5F3EA] hover:bg-[#991b1b] transition-colors"
                    disabled={!currentAttachment}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Delete Selected
                  </button>
                </div>
              </>
            ) : (
              <div className="rounded-3xl border border-dashed border-[#87A96B]/40 bg-[#071c15]/60 p-10 text-center text-sm text-[#D1CDBC]">
                No attachments yet. Upload files from the assignment card to preview them here.
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-[#87A96B]/20">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-[#14532D]/40 border border-[#87A96B]/30 text-xs text-[#A7F3D0]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
