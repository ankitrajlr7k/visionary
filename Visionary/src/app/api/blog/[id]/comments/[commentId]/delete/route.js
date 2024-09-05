// app/api/blog/[id]/comments/[commentId]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Ensure this path is correct

export async function DELETE(request, { params }) {
  const { id, commentId } = params;

  try {
    // Delete the comment from the database
    await prisma.comment.delete({
      where: { id: commentId },
    });

    // Optionally, you might want to return the updated list of comments or a success message
    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment.' }, { status: 500 });
  }
}
