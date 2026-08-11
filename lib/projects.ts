import fs from 'fs';
import path from 'path';
import projectsData from '@/content/projects.json';
import { Project } from '@/types/project';

export function getAllProjects(): Project[] {
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

export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured);
}

export function getProjectsByCategory(category: string): Project[] {
  if (!category || category === 'All') return getAllProjects();
  return getAllProjects().filter((p) => p.category === category);
}
