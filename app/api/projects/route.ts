import { NextResponse } from 'next/server';
import { Project } from '@/types/project';
import { getAllProjects, mapProjectToDb } from '@/lib/projects';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = await getAllProjects();
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

    // 1. Sync to Supabase
    try {
      const dbProjects = projects.map(mapProjectToDb);
      
      if (dbProjects.length > 0) {
        // Upsert all projects
        const { error: upsertError } = await supabase
          .from('projects')
          .upsert(dbProjects, { onConflict: 'slug' });

        if (upsertError) {
          throw upsertError;
        }

        // Delete any projects from DB that are no longer in the client-submitted payload
        const activeSlugs = projects.map((p) => p.slug);
        const { error: deleteError } = await supabase
          .from('projects')
          .delete()
          .not('slug', 'in', `(${activeSlugs.join(',')})`);

        if (deleteError) {
          console.warn('Failed to delete retired projects from Supabase:', deleteError);
        }
      } else {
        // Clear all projects if empty
        const { error: clearError } = await supabase
          .from('projects')
          .delete()
          .neq('slug', '');
        if (clearError) {
          console.warn('Failed to clear projects from Supabase:', clearError);
        }
      }
    } catch (dbErr) {
      console.error('Failed to write to Supabase database:', dbErr);
    }

    // 2. Fallback local filesystem write for dev backup
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'content', 'projects.json');
      fs.writeFileSync(filePath, JSON.stringify(projects, null, 2), 'utf8');
    } catch (fsErr) {
      console.warn('Local projects.json backup write failed:', fsErr);
    }

    return NextResponse.json({ success: true, count: projects.length });
  } catch (error) {
    console.error('Failed to handle projects payload:', error);
    return NextResponse.json({ error: 'Failed to save projects' }, { status: 500 });
  }
}
