import React from 'react';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getAllProjects } from '@/lib/projects';
import { ProjectSlugClient } from './ProjectSlugClient';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found | EcoPulse' };

  return {
    title: `${project.title} | EcoPulse E-Waste Portfolio`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.subtitle,
      images: [{ url: project.coverImage }],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectSlugClient project={project} />;
}

