'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Project, ProjectCategory } from '@/types/project';
import { Search, Filter, ArrowUpRight, FileText, Image as ImageIcon, Video, Award, Code, Layers, Trash2, UploadCloud, Edit3 } from 'lucide-react';

/* ProjectsGridSectionProps defined below with onUpdateProject */

const categoryIcons: Record<string, React.ReactNode> = {
  Poster: <ImageIcon className="w-3.5 h-3.5 text-[#A7F3D0]" />,
  'PDF & Research': <FileText className="w-3.5 h-3.5 text-sky-400" />,
  Prototype: <Code className="w-3.5 h-3.5 text-[#D4A373]" />,
  'Video & Reel': <Video className="w-3.5 h-3.5 text-pink-400" />,
  Certificate: <Award className="w-3.5 h-3.5 text-yellow-400" />,
  Campaign: <Layers className="w-3.5 h-3.5 text-emerald-400" />,
  Others: <Layers className="w-3.5 h-3.5 text-[#A7F3D0]" />,
};

interface ProjectsGridSectionProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
  onAddProject: (project: Project) => void;
  onUpdateProject?: (project: Project) => void;
  onDeleteProject: (slug: string) => void;
  onUploadAttachments: (slug: string, files: FileList) => void;
}

export function ProjectsGridSection({ projects, onOpenProject, onAddProject, onUpdateProject, onDeleteProject, onUploadAttachments }: ProjectsGridSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newProject, setNewProject] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: 'Poster',
    customCategory: '',
    date: new Date().toISOString().slice(0, 7),
    regionName: '',
    lat: '',
    lng: '',
    coverImage: '',
    coverImageName: '',
  });

  const categories = ['All', 'Poster', 'PDF & Research', 'Prototype', 'Video & Reel', 'Certificate', 'Campaign', 'Others'];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  const canAddProject =
    newProject.title.trim() !== '' &&
    newProject.description.trim() !== '' &&
    (newProject.category !== 'Others' || newProject.customCategory.trim() !== '');

  const handleNewProjectChange = (key: keyof typeof newProject, value: string) => {
    setNewProject((prev) => ({ ...prev, [key]: value }));
  };

  const generateSlug = (title: string) => {
    const base = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    let slug = base || `assignment-${Date.now()}`;
    // ensure uniqueness against existing project slugs
    const existing = new Set(projects.map((p) => p.slug));
    let i = 1;
    while (existing.has(slug)) {
      slug = `${base || `assignment-${Date.now()}`}-${i}`;
      i += 1;
    }
    return slug;
  };

  const handleCoverImageUpload = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setNewProject((prev) => ({
          ...prev,
          coverImage: result,
          coverImageName: file.name,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const startEdit = (project: Project) => {
    setEditingSlug(project.slug);
    setNewProject({
      title: project.title,
      subtitle: project.subtitle || '',
      description: project.description || '',
      category: project.category || 'Poster',
      customCategory: project.customCategory || '',
      date: project.date || new Date().toISOString().slice(0, 7),
      regionName: project.location?.regionName || '',
      lat: String(project.location?.lat ?? ''),
      lng: String(project.location?.lng ?? ''),
      coverImage: project.coverImage || '',
      coverImageName: project.coverImage ? (project.coverImage.split('/').pop() || '') : '',
    });
    // bring the form into view
    const el = document.querySelector('#projects-grid');
    if (el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingSlug(null);
    setNewProject({
      title: '',
      subtitle: '',
      description: '',
      category: 'Poster',
      customCategory: '',
      date: new Date().toISOString().slice(0, 7),
      regionName: '',
      lat: '',
      lng: '',
      coverImage: '',
      coverImageName: '',
    });
  };

  const handleSaveEdit = () => {
    if (!editingSlug) return;
    const original = projects.find((p) => p.slug === editingSlug);
    const updated: Project = {
      slug: editingSlug,
      title: newProject.title,
      subtitle: newProject.subtitle || 'Custom assignment',
      description: newProject.description,
      category: newProject.category as ProjectCategory,
      customCategory: newProject.category === 'Others' ? newProject.customCategory : undefined,
      date: newProject.date,
      location: {
        lat: Number(newProject.lat) || 0,
        lng: Number(newProject.lng) || 0,
        regionName: newProject.regionName || 'Custom Region',
      },
      coverImage: newProject.coverImage || (original?.coverImage ?? ''),
      tags: original?.tags ?? [],
      attachments: original?.attachments ?? [],
    };
    if (onUpdateProject) onUpdateProject(updated);
    cancelEdit();
  };

  const handleAddProject = () => {
    if (!canAddProject) return;

    const slug = generateSlug(newProject.title);
    const project: Project = {
      slug,
      title: newProject.title,
      subtitle: newProject.subtitle || 'Custom assignment',
      description: newProject.description,
      category: newProject.category as ProjectCategory,
      customCategory: newProject.category === 'Others' ? newProject.customCategory : undefined,
      date: newProject.date,
      location: {
        lat: Number(newProject.lat) || 0,
        lng: Number(newProject.lng) || 0,
        regionName: newProject.regionName || 'Custom Region',
      },
      coverImage:
        newProject.coverImage ||
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
      tags: [],
      attachments: [],
    };

    onAddProject(project);
    setNewProject({
      title: '',
      subtitle: '',
      description: '',
      category: 'Poster',
      customCategory: '',
      date: new Date().toISOString().slice(0, 7),
      regionName: '',
      lat: '',
      lng: '',
      coverImage: '',
      coverImageName: '',
    });
  };

  return (
    <section id="projects-grid" className="py-24 px-4 md:px-8 bg-[#071c15] border-t border-[#87A96B]/15">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.95fr]">
          <div className="glass-panel rounded-3xl p-6 border border-[#87A96B]/20 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-[#F5F3EA]">Create Assignment Card</h3>
                <p className="text-sm text-[#D1CDBC]">
                  Add a custom assignment card and upload attachments for the globe and grid.
                </p>
              </div>
              {editingSlug ? (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={!canAddProject}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      canAddProject
                        ? 'bg-[#87A96B] text-[#071c15] hover:bg-[#A7F3D0]'
                        : 'bg-[#0b2b20] text-[#64748b] cursor-not-allowed'
                    }`}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 rounded-full text-sm font-semibold bg-[#0b2b20] text-[#D1CDBC] hover:bg-[#123d2e] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAddProject}
                  disabled={!canAddProject}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    canAddProject
                      ? 'bg-[#87A96B] text-[#071c15] hover:bg-[#A7F3D0]'
                      : 'bg-[#0b2b20] text-[#64748b] cursor-not-allowed'
                  }`}
                >
                  Add Card
                </button>
              )}
            </div>

            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Title"
                value={newProject.title}
                onChange={(e) => handleNewProjectChange('title', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#071c15] border border-[#87A96B]/20 text-sm text-[#F5F3EA] focus:outline-none focus:border-[#A7F3D0]"
              />
              <input
                type="text"
                placeholder="Subtitle"
                value={newProject.subtitle}
                onChange={(e) => handleNewProjectChange('subtitle', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#071c15] border border-[#87A96B]/20 text-sm text-[#F5F3EA] focus:outline-none focus:border-[#A7F3D0]"
              />
              <textarea
                rows={4}
                placeholder="Description"
                value={newProject.description}
                onChange={(e) => handleNewProjectChange('description', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#071c15] border border-[#87A96B]/20 text-sm text-[#F5F3EA] focus:outline-none focus:border-[#A7F3D0] resize-none"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <select
                  value={newProject.category}
                  onChange={(e) => handleNewProjectChange('category', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#071c15] border border-[#87A96B]/20 text-sm text-[#F5F3EA] focus:outline-none focus:border-[#A7F3D0]"
                >
                  <option>Poster</option>
                  <option>PDF & Research</option>
                  <option>Prototype</option>
                  <option>Video & Reel</option>
                  <option>Certificate</option>
                  <option>Campaign</option>
                  <option>Others</option>
                </select>
                <input
                  type="month"
                  value={newProject.date}
                  onChange={(e) => handleNewProjectChange('date', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#071c15] border border-[#87A96B]/20 text-sm text-[#F5F3EA] focus:outline-none focus:border-[#A7F3D0]"
                />
              </div>
              {newProject.category === 'Others' && (
                <input
                  type="text"
                  placeholder="Custom assignment type"
                  value={newProject.customCategory}
                  onChange={(e) => handleNewProjectChange('customCategory', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#071c15] border border-[#87A96B]/20 text-sm text-[#F5F3EA] focus:outline-none focus:border-[#A7F3D0]"
                />
              )}
              <div className="grid gap-4 md:grid-cols-3">
                <input
                  type="text"
                  placeholder="Region Name"
                  value={newProject.regionName}
                  onChange={(e) => handleNewProjectChange('regionName', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#071c15] border border-[#87A96B]/20 text-sm text-[#F5F3EA] focus:outline-none focus:border-[#A7F3D0]"
                />
                <input
                  type="number"
                  placeholder="Latitude"
                  value={newProject.lat}
                  onChange={(e) => handleNewProjectChange('lat', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#071c15] border border-[#87A96B]/20 text-sm text-[#F5F3EA] focus:outline-none focus:border-[#A7F3D0]"
                />
                <input
                  type="number"
                  placeholder="Longitude"
                  value={newProject.lng}
                  onChange={(e) => handleNewProjectChange('lng', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#071c15] border border-[#87A96B]/20 text-sm text-[#F5F3EA] focus:outline-none focus:border-[#A7F3D0]"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-[#D1CDBC]">Cover Preview</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => document.getElementById('cover-image-upload')?.click()}
                    className="inline-flex items-center justify-center rounded-2xl bg-[#14532D] px-4 py-3 text-sm font-semibold text-[#A7F3D0] hover:bg-[#1f512f] transition-colors"
                  >
                    Upload Cover Image
                  </button>
                  <span className="text-xs text-[#D1CDBC]">
                    {newProject.coverImageName || 'No image selected, defaults will be used.'}
                  </span>
                </div>
                {newProject.coverImageName && newProject.coverImage && (
                  <div className="overflow-hidden rounded-3xl border border-[#87A96B]/20 h-40">
                    <img src={newProject.coverImage} alt="Cover preview" className="h-full w-full object-cover" />
                  </div>
                )}
                <input
                  id="cover-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    handleCoverImageUpload(file);
                    e.currentTarget.value = '';
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Search Input Bar */}
            <div className="relative min-w-[280px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#87A96B]" />
              <input
                type="text"
                placeholder="Search assignments or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#0b2b20] border border-[#87A96B]/30 text-sm text-[#F5F3EA] placeholder-[#D1CDBC]/50 focus:outline-none focus:border-[#A7F3D0] transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === cat
                      ? 'bg-[#87A96B] text-[#071c15] font-semibold glow-mint shadow-lg'
                      : 'glass-panel text-[#D1CDBC] hover:border-[#87A96B]/50'
                  }`}
                >
                  {categoryIcons[cat]}
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl space-y-3">
            <p className="text-lg text-[#D1CDBC]">No assignments matched your search.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-xs text-[#A7F3D0] underline hover:text-[#87A96B]"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.slug}
                onClick={() => onOpenProject(project)}
                className="group cursor-pointer glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-[#87A96B]/20 flex flex-col justify-between"
              >
                {/* Cover Image Header */}
                <div className="relative w-full h-52 overflow-hidden bg-[#071c15]">
                  {project.coverImage.startsWith('blob:') || project.coverImage.startsWith('data:') ? (
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b2b20] via-transparent to-transparent opacity-80" />

                  {/* Category Pill Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#071c15]/80 backdrop-blur-md border border-[#87A96B]/40 text-xs font-semibold text-[#F5F3EA]">
                    {categoryIcons[project.category]}
                    <span>
                      {project.category === 'Others' && project.customCategory
                        ? `Others: ${project.customCategory}`
                        : project.category}
                    </span>
                  </div>
                  {/* Attachments Count Badge */}
                  <div className="absolute bottom-3 right-3 text-[11px] px-2.5 py-0.5 rounded-full bg-[#14532D]/80 border border-[#A7F3D0]/30 text-[#A7F3D0] font-mono">
                    {project.attachments.length} attachment{project.attachments.length > 1 ? 's' : ''}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-serif font-bold text-[#F5F3EA] group-hover:text-[#A7F3D0] transition-colors flex items-center justify-between">
                      <span>{project.title}</span>
                      <ArrowUpRight className="w-4 h-4 text-[#87A96B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </h3>
                    <p className="text-xs font-medium text-[#87A96B] line-clamp-1">{project.subtitle}</p>
                    <p className="text-xs text-[#D1CDBC] line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Impact Stats or Tags */}
                  <div className="pt-3 border-t border-[#87A96B]/15 space-y-3">
                    {project.impactStats && project.impactStats.length > 0 && (
                      <div className="flex items-center gap-4 text-[11px]">
                        {project.impactStats.slice(0, 2).map((stat, i) => (
                          <div key={i} className="flex flex-col">
                            <span className="text-[#87A96B] font-semibold">{stat.value}</span>
                            <span className="text-[#D1CDBC]/70">{stat.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                startEdit(project);
                              }}
                              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b2b20] text-xs font-semibold text-[#D1CDBC] hover:bg-[#123d2e] transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit
                            </button>
                          </div>

                          <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const input = document.getElementById(`upload-${project.slug}`) as HTMLInputElement | null;
                          input?.click();
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#14532D] text-xs font-semibold text-[#A7F3D0] hover:bg-[#1f512f] transition-colors"
                      >
                        <UploadCloud className="w-4 h-4" />
                        Upload Attachments
                      </button>

                      <input
                        id={`upload-${project.slug}`}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          e.stopPropagation();
                          if (e.target.files) {
                            onUploadAttachments(project.slug, e.target.files);
                          }
                          e.currentTarget.value = '';
                        }}
                      />

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(project.slug);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7f1d1d] text-xs font-semibold text-[#F5F3EA] hover:bg-[#991b1b] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Card
                      </button>
                    </div>

                    {/* Tag Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-[#14532D]/30 border border-[#87A96B]/20 text-[10px] text-[#A7F3D0]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
