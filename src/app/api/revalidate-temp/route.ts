import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET() {
  revalidatePath('/agb');
  revalidatePath('/datenschutz');
  revalidatePath('/impressum');
  revalidatePath('/', 'layout');
  return NextResponse.json({ revalidated: true });
}
