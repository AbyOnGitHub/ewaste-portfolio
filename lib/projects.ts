import fs from 'fs';
import path from 'path';
import projectsData from '@/content/projects.json';
import { Project } from '@/types/project';
import { supabase } from './supabase';

// Helper to map DB row to Project interface
export function mapProjectFromDb(p: any): Project {
  return {
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    description: p.description,
    longDescription: p.long_description || undefined,
    category: p.category,
    customCategory: p.custom_category || undefined,
    date: p.date,
    location: p.location,
    coverImage: p.cover_image,
    tags: p.tags || [],
    featured: p.featured || false,
    impactStats: p.impact_stats || undefined,
    attachments: p.attachments || [],
  };
}

// Helper to map Project interface to DB row
export function mapProjectToDb(p: Project) {
  return {
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    description: p.description,
    long_description: p.longDescription || null,
    category: p.category,
    custom_category: p.customCategory || null,
    date: p.date,
    location: p.location,
    cover_image: p.coverImage,
    tags: p.tags || [],
    featured: p.featured || false,
    impact_stats: p.impactStats || [],
    attachments: p.attachments || [],
  };
}

// Helper to get fallback projects from filesystem
function getFallbackProjects(): Project[] {
  if (typeof window === 'undefined') {
    try {
      const filePath = path.join(process.cwd(), 'content', 'projects.json');
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent) as Project[];
      }
    } catch (e) {
      console.error('Failed to read projects.json dynamically:', e);
    }
  }
  return projectsData as Project[];
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase query error, falling back to JSON:', error);
      return getFallbackProjects();
    }

    if (data && data.length > 0) {
      return data.map(mapProjectFromDb);
    }
  } catch (err) {
    console.error('Failed to query Supabase projects, using fallback:', err);
  }
  return getFallbackProjects();
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error(`Supabase error for slug ${slug}, falling back:`, error);
      return getFallbackProjects().find((p) => p.slug === slug);
    }

    if (data) {
      return mapProjectFromDb(data);
    }
  } catch (err) {
    console.error('Failed to query Supabase project by slug, using fallback:', err);
  }
  return getFallbackProjects().find((p) => p.slug === slug);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getAllProjects();
  return projects.filter((p) => p.featured);
}

export async function getProjectsByCategory(category: string): Promise<Project[]> {
  if (!category || category === 'All') return getAllProjects();
  const projects = await getAllProjects();
  return projects.filter((p) => p.category === category);
}
