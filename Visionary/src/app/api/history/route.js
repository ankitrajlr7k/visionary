
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    // Extract the user ID from the request headers
    const userId = request.headers.get('user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const images = await prisma.image.findMany({
      where: { userId },
      orderBy: { generatedAt: 'desc' }, // Order by the most recent first
    });

    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { generatedAt: 'desc' }, // Ensure createdAt exists in the chat model
    });

    // Respond with the fetched data
    return NextResponse.json({ images, chats });
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    // Parse the request body to get the ID and type of item to delete
    const { id, type } = await request.json();

    if (!id || !type) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const userId = request.headers.get('user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (type === 'image') {
      await prisma.image.deleteMany({
        where: { id, userId },
      });
    } else if (type === 'chat') {
      await prisma.chat.deleteMany({
        where: { id, userId },
      });
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    // Respond with success message
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}
