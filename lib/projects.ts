import projectsData from '@/content/projects.json';
import { Project } from '@/types/project';

export function getAllProjects(): Project[] {
  return projectsData as Project[];
}

export function getProjectBySlug(slug: string): Project | undefined {
  return (projectsData as Project[]).find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return (projectsData as Project[]).filter((p) => p.featured);
}

export function getProjectsByCategory(category: string): Project[] {
  if (!category || category === 'All') return getAllProjects();
  return (projectsData as Project[]).filter((p) => p.category === category);
}
