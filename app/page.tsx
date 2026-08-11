'use client';

import React, { useState, useEffect } from 'react';
import projectsData from '@/content/projects.json';
import { Project, AttachmentType } from '@/types/project';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { EarthSection } from '@/components/sections/EarthSection';
import { ProjectsGridSection } from '@/components/sections/ProjectsGridSection';
import { ContactFooter } from '@/components/sections/ContactFooter';
import { ProjectDetailModal } from '@/components/modals/ProjectDetailModal';
import { Leaf, Globe, Layers, Mail } from 'lucide-react';

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>(() =>
    (projectsData as Project[]).map((project) => ({ ...project, attachments: project.attachments ?? [] }))
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Helper to save projects to the backend JSON API
  const saveProjectsToServer = async (updatedProjects: Project[]) => {
    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProjects),
      });
    } catch (error) {
      console.error('Failed to sync projects to server:', error);
    }
  };

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setProjects(data);
            window.localStorage.setItem('ewaste-projects', JSON.stringify(data));
            return;
          }
        }
      } catch (error) {
        console.error('Failed to load projects from server:', error);
      }

      const stored = window.localStorage.getItem('ewaste-projects');
      if (stored) {
        try {
          setProjects(JSON.parse(stored));
        } catch {
          // Keep default state
        }
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    const refreshed = projects.find((p) => p.slug === selectedProject.slug);
    if (!refreshed) {
      setSelectedProject(null);
      return;
    }
    if (refreshed !== selectedProject) {
      setSelectedProject(refreshed);
    }
  }, [projects, selectedProject]);

  const handleAddProject = (project: Project) => {
    setProjects((prev) => {
      const next = [...prev, project];
      window.localStorage.setItem('ewaste-projects', JSON.stringify(next));
      saveProjectsToServer(next);
      return next;
    });
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects((prev) => {
      const next = prev.map((p) => (p.slug === updated.slug ? updated : p));
      window.localStorage.setItem('ewaste-projects', JSON.stringify(next));
      saveProjectsToServer(next);
      return next;
    });
  };

  const handleDeleteProject = (slug: string) => {
    setProjects((prev) => {
      const next = prev.filter((project) => project.slug !== slug);
      window.localStorage.setItem('ewaste-projects', JSON.stringify(next));
      saveProjectsToServer(next);
      return next;
    });
    setSelectedProject((current) => (current?.slug === slug ? null : current));
  };

  const handleDeleteAttachment = (slug: string, attachmentId: string) => {
    setProjects((prev) => {
      const next = prev.map((project) =>
        project.slug === slug
          ? {
              ...project,
              attachments: project.attachments.filter((att) => att.id !== attachmentId),
            }
          : project
      );
      window.localStorage.setItem('ewaste-projects', JSON.stringify(next));
      saveProjectsToServer(next);
      return next;
    });
  };

  const handleUploadAttachments = async (slug: string, files: FileList) => {
    const project = projects.find((item) => item.slug === slug);
    if (!project) return;

    const determineType = (file: File): AttachmentType => {
      if (file.type.startsWith('image/')) return 'image';
      if (file.type === 'application/pdf') return 'pdf';
      if (file.type.startsWith('video/')) return 'video';
      return 'document';
    };

    // Helper to convert File to data URL for persistent storage
    const fileToDataUrl = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') resolve(reader.result);
          else reject(new Error('Failed to read file as data URL'));
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });

    const uploadedAttachments = await Promise.all(
      Array.from(files).map(async (file, index) => {
        // start reading dataURL in parallel so it's available if upload falls back
        const dataUrlPromise = fileToDataUrl(file);
        let url: string | null = null;
        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: file.name, contentType: file.type || 'application/octet-stream' }),
          });
          const json = await response.json();
          // prefer server URL when provided; when mock or missing, use data URL
          if (json?.url) url = json.url;
          else url = await dataUrlPromise;
        } catch {
          // upload failed — use data URL so the file persists across reloads
          url = await dataUrlPromise;
        }

        return {
          id: `${slug}-${Date.now()}-${index}`,
          type: determineType(file),
          title: file.name,
          description: `${Math.round(file.size / 1024)} KB`,
          url: url || '', // ensure url is never null
        };
      })
    );

    setProjects((prev) => {
      const next = prev.map((item) =>
        item.slug === slug
          ? { ...item, attachments: [...(item.attachments ?? []), ...uploadedAttachments] }
          : item
      );
      window.localStorage.setItem('ewaste-projects', JSON.stringify(next));
      saveProjectsToServer(next);
      return next;
    });
  };

  return (
    <div className="relative min-h-screen bg-[#071c15] text-[#F5F3EA] selection:bg-[#4C7C59] selection:text-[#A7F3D0]">
      {/* Top Floating Glass Header Navigation */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-6xl px-6 py-3.5 rounded-full glass-panel border border-[#87A96B]/30 shadow-2xl flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-full bg-[#14532D] text-[#A7F3D0] group-hover:scale-110 transition-transform glow-mint">
            <Leaf className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-lg text-[#F5F3EA] tracking-tight">
            Abedan<span className="text-[#A7F3D0]">Biswal</span>
          </span>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#D1CDBC]">
          <a href="#about" className="hover:text-[#A7F3D0] transition-colors">
            About & Mission
          </a>
          <a href="#earth-globe" className="hover:text-[#A7F3D0] transition-colors flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-[#87A96B]" />
            <span>My Work World</span>
          </a>
          <a href="#projects-grid" className="hover:text-[#A7F3D0] transition-colors">
            Assignments Grid
          </a>
        </nav>

        {/* CTA Button */}
        <a
          href="#contact"
          className="px-4 py-2 rounded-full bg-[#87A96B] text-[#071c15] font-semibold text-xs hover:bg-[#A7F3D0] transition-all glow-mint flex items-center gap-1.5"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Contact</span>
        </a>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* About & Mission Section */}
      <AboutSection />

      {/* Pinned 3D Earth Centerpiece Section */}
      <EarthSection projects={projects} onOpenProject={(p) => setSelectedProject(p)} />

      {/* Filterable Projects Grid Section */}
      <ProjectsGridSection
        projects={projects}
        onOpenProject={(p) => setSelectedProject(p)}
        onAddProject={handleAddProject}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
        onUploadAttachments={handleUploadAttachments}
      />

      {/* Footer & Contact Section */}
      <ContactFooter />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onDeleteAttachment={handleDeleteAttachment}
      />
    </div>
  );
}
