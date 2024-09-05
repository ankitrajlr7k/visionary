import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Ensure this path is correct

export async function PUT(request, { params }) {
  const { id } = params;
  const { content } = await request.json();

  try {
    // Update the blog post
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: { content },
    });
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post.' }, { status: 500 });
  }
}
