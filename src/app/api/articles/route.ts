import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const where = category ? { category, isPublished: true } : {};
    
    const articles = await prisma.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' }
    });
    
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Auto-generate slug if not provided
    if (!body.slug && body.title) {
      body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    // Auto-generate excerpt (SEO) if not provided
    let excerpt = body.excerpt;
    if (!excerpt || excerpt.trim() === '') {
      excerpt = `${body.title} makalesi. Eğitim, danışmanlık ve entegrasyon hakkındaki en güncel yazılarımızı okumak için hemen tıklayın.`;
    }

    const article = await prisma.article.create({
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: excerpt,
        content: body.content,
        coverImage: body.coverImage,
        category: body.category || 'ALLGEMEIN',
        tags: body.tags,
        author: body.author,
        isPublished: body.isPublished !== undefined ? body.isPublished : true,
      }
    });
    
    return NextResponse.json(article);
  } catch (error: any) {
    console.error('Failed to create article:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Ein Artikel mit dieser URL (Slug) existiert bereits.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
