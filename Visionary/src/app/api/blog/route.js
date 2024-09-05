import prisma from '@/lib/prisma';

export async function GET(request) {
  const { title = '', page = 1, pageSize = 10 } = new URL(request.url).searchParams;
  
  const skip = (parseInt(page) - 1) * parseInt(pageSize);
  const take = parseInt(pageSize);

  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            email: true,
            name: true, // Include name if you also want the user's name
          },
        },
        comments: {
          select: {
            id: true, // Just selecting id to count the number of comments
          },
        },
      },
    });

    // Add a custom field for the number of comments
    const postsWithCommentsCount = posts.map(post => ({
      ...post,
      commentsCount: post.comments.length,
    }));

    return new Response(JSON.stringify(postsWithCommentsCount), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Internal server error', { status: 500 });
  }
}
