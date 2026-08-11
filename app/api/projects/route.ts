import { NextResponse } from 'next/server';
import { Project } from '@/types/project';
import { getAllProjects, mapProjectToDb, mapProjectFromDb } from '@/lib/projects';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// ────────────────────────────────────────────────────────────────────────────
// GET /api/projects — fetch all projects from Supabase, seed from JSON if empty
// ────────────────────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const projects = await getAllProjects();

    // If Supabase has no data yet, seed it from the JSON file
    const { count } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    if (count === 0 && projects.length > 0) {
      const dbProjects = projects.map(mapProjectToDb);
      await supabase.from('projects').insert(dbProjects);
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// ────────────────────────────────────────────────────────────────────────────
// POST /api/projects — INSERT a single new project
// Body: { project: Project }
// ────────────────────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const { project }: { project: Project } = await request.json();

    if (!project || !project.slug) {
      return NextResponse.json({ error: 'Valid project with a slug is required.' }, { status: 400 });
    }

    const dbRow = mapProjectToDb(project);
    const { data, error } = await supabase
      .from('projects')
      .insert(dbRow)
      .select()
      .single();

    if (error) {
      console.error('Supabase INSERT error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, project: mapProjectFromDb(data) });
  } catch (error) {
    console.error('POST /api/projects error:', error);
    return NextResponse.json({ error: 'Failed to insert project' }, { status: 500 });
  }
}

// ────────────────────────────────────────────────────────────────────────────
// PUT /api/projects — UPDATE a single existing project (identified by slug)
// Body: { project: Project }
// ────────────────────────────────────────────────────────────────────────────
export async function PUT(request: Request) {
  try {
    const { project }: { project: Project } = await request.json();

    if (!project || !project.slug) {
      return NextResponse.json({ error: 'Valid project with a slug is required.' }, { status: 400 });
    }

    const dbRow = mapProjectToDb(project);
    const { data, error } = await supabase
      .from('projects')
      .update(dbRow)
      .eq('slug', project.slug)
      .select()
      .single();

    if (error) {
      console.error('Supabase UPDATE error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, project: mapProjectFromDb(data) });
  } catch (error) {
    console.error('PUT /api/projects error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// ────────────────────────────────────────────────────────────────────────────
// DELETE /api/projects — DELETE a project by slug
// Body: { slug: string }
// ────────────────────────────────────────────────────────────────────────────
export async function DELETE(request: Request) {
  try {
    const { slug }: { slug: string } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'slug is required.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('slug', slug);

    if (error) {
      console.error('Supabase DELETE error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deleted: slug });
  } catch (error) {
    console.error('DELETE /api/projects error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

// ────────────────────────────────────────────────────────────────────────────
// PATCH /api/projects — UPDATE attachments for a project (upsert attachments array)
// Body: { slug: string, attachments: Attachment[] }
// ────────────────────────────────────────────────────────────────────────────
export async function PATCH(request: Request) {
  try {
    const { slug, attachments } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'slug is required.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('projects')
      .update({ attachments })
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      console.error('Supabase PATCH attachments error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, project: mapProjectFromDb(data) });
  } catch (error) {
    console.error('PATCH /api/projects error:', error);
    return NextResponse.json({ error: 'Failed to update attachments' }, { status: 500 });
  }
}
