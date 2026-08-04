export type AttachmentType = 
  | 'image' 
  | 'pdf' 
  | 'certificate' 
  | 'prototype' 
  | 'referral' 
  | 'video' 
  | 'reel' 
  | 'website_preview' 
  | 'document';

export interface Attachment {
  id: string;
  type: AttachmentType;
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  embedUrl?: string;
  aspectRatio?: '16:9' | '9:16' | '4:3' | '1:1';
}

export type ProjectCategory = 
  | 'Poster' 
  | 'PDF & Research' 
  | 'Certificate' 
  | 'Prototype' 
  | 'Video & Reel' 
  | 'Campaign' 
  | 'Others';

export interface ProjectLocation {
  lat: number;
  lng: number;
  regionName: string;
}

export interface ImpactStat {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription?: string;
  category: ProjectCategory;
  customCategory?: string;
  date: string;
  location: ProjectLocation;
  coverImage: string;
  tags: string[];
  featured?: boolean;
  impactStats?: ImpactStat[];
  attachments: Attachment[];
}
