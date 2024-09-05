// src/app/api/blog/[id]/route.js
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const blogPost = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        comments: true, // Include comments with the blog post
      },
    });

    if (!blogPost) {
      return new Response('Blog post not found', { status: 404 });
    }

    return new Response(JSON.stringify(blogPost), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response('Internal server error', { status: 500 });
  }
}
