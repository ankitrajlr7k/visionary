
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    // Parse the request body to get imageUrl and userId
    const { imageUrl, userId } = await request.json();

    // Update the `isPublic` field to true for the specified image
    const updatedImage = await prisma.image.updateMany({
      where: {
        userId: userId,
        url: imageUrl,
      },
      data: {
        isPublic: true,
      },
    });

    if (updatedImage.count === 0) {
      // If no image was updated, send a not found response
      return NextResponse.json({ error: 'Image not found or not authorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Image posted to public' });
  } catch (error) {
    console.error('Error posting image to public:', error);
    return NextResponse.json({ error: 'Error posting image to public' }, { status: 500 });
  } finally {
    // Ensure the Prisma Client is properly disconnected
    await prisma.$disconnect();
  }
}
