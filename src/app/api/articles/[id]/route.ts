import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Treat id as slug for public fetching, or UUID for admin
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    
    const article = await prisma.article.findFirst({
      where: isUuid ? { id } : { slug: id }
    });
    
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    return NextResponse.json(article);
  } catch (error) {
    console.error('Failed to fetch article:', error);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    if (body.title && !body.slug) {
      body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    let excerpt = body.excerpt;
    if (!excerpt || excerpt.trim() === '') {
      excerpt = `${body.title} makalesi. Eğitim, danışmanlık ve entegrasyon hakkındaki en güncel yazılarımızı okumak için hemen tıklayın.`;
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: excerpt,
        content: body.content,
        coverImage: body.coverImage,
        category: body.category,
        tags: body.tags,
        author: body.author,
        isPublished: body.isPublished,
      }
    });
    
    return NextResponse.json(article);
  } catch (error: any) {
    console.error('Failed to update article:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Ein Artikel mit dieser URL (Slug) existiert bereits.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.article.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete article:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
