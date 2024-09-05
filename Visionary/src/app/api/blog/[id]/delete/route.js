// src/app/api/blog/[id]/delete/route.js

import prisma from '@/lib/prisma';

export async function DELETE(request, { params }) {
  const { id } = params;
  
  try {
    // Delete the blog post
    const deletedPost = await prisma.blogPost.delete({
      where: { id },
    });

    return new Response(JSON.stringify(deletedPost), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log(error)
    return new Response('Internal server error', { status: 500 });
  }
}
