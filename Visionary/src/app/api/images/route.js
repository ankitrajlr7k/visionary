import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const images = await prisma.image.findMany({
      where: { isPublic: true },
    });
    return new Response(JSON.stringify(images), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Error fetching images', { status: 500 });
  }
}
