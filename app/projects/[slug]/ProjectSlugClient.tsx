'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Project } from '@/types/project';
import { ProjectDetailModal } from '@/components/modals/ProjectDetailModal';
import { ArrowLeft, Leaf } from 'lucide-react';

interface ProjectSlugClientProps {
  project: Project;
}

export function ProjectSlugClient({ project }: ProjectSlugClientProps) {
  const router = useRouter();

  const handleClose = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#071c15] text-[#F5F3EA] p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="mb-6 flex items-center justify-between w-full max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-[#87A96B]/30 text-xs text-[#A7F3D0] hover:bg-[#14532D]/50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio & 3D Earth</span>
        </Link>

        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4 text-[#A7F3D0]" />
          <span className="font-serif font-bold text-sm">EcoPulse</span>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        <ProjectDetailModal project={project} onClose={handleClose} />
      </div>
    </div>
  );
}
