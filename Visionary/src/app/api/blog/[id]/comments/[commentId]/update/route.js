import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Ensure this path is correct

export async function PUT(request, { params }) {
  const { commentId } = params;
  const { content } = await request.json();

  try {
    // Update the comment
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });
    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ error: 'Failed to update comment.' }, { status: 500 });
  }
}

