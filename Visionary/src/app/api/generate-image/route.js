// app/api/generate-image/route.js
import { NextResponse } from 'next/server';
import { storage } from '@/lib/firebaseabc'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import prisma from '@/lib/prisma';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

async function query(data) {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error generating image');
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadToFirebase(imageBuffer) {
  const fileName = `images/${Date.now()}.png`;
  const storageRef = ref(storage, fileName);

  const blob = new Blob([imageBuffer], { type: 'image/png' });
  await uploadBytes(storageRef, blob);

  const url = await getDownloadURL(storageRef);
  return url;
}

export async function POST(request) {
  try {
    const userId = request.headers.get('user-id');

    if (!userId) {
      console.error('User ID is undefined');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text } = await request.json();

    const imageBuffer = await query({ inputs: text });
    const imageUrl = await uploadToFirebase(imageBuffer);

    const image = await prisma.image.create({
      data: {
        url: imageUrl,
        prompt: text,
        userId: userId,
      },
    });

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}
