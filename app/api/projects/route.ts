import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Project } from '@/types/project';
import { getAllProjects } from '@/lib/projects';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const projects: Project[] = await request.json();
    
    if (!Array.isArray(projects)) {
      return NextResponse.json({ error: 'Invalid data format. Expected an array of projects.' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'content', 'projects.json');
    fs.writeFileSync(filePath, JSON.stringify(projects, null, 2), 'utf8');

    return NextResponse.json({ success: true, count: projects.length });
  } catch (error) {
    console.error('Failed to write projects:', error);
    return NextResponse.json({ error: 'Failed to save projects' }, { status: 500 });
  }
}
