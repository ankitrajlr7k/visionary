import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { chatId, userId } = await request.json();
    console.log('Chat ID:', chatId);
    console.log('User ID:', userId);

    // Find the chat based on the provided chatId
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Create a new blog post using the chat's data
    const blogPost = await prisma.blogPost.create({
      data: {
        title: chat.prompt,
        content: chat.response,
        userId,
        chatId: chat.id,
      },
    });

    // Update the chat to link the blog post
    await prisma.chat.update({
      where: { id: chat.id },
      data: {
        blogPost: { connect: { id: blogPost.id } },
        blogPostupdated:true,
      },
    });

    return NextResponse.json(blogPost, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
