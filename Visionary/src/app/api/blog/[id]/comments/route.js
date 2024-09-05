import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const comments = await prisma.comment.findMany({
      where: { blogPostId: id },
      include: {
        user: {
          select: { email: true } // Fetch the user's email
        }
      }
    });

    // Map comments to include userEmail
    const commentsWithEmail = comments.map(comment => ({
      ...comment,
      userEmail: comment.user.email // Add userEmail to the comment object
    }));

    return new Response(JSON.stringify(commentsWithEmail), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response('Internal server error', { status: 500 });
  }
}
