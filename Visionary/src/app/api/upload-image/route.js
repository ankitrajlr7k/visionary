import { storage } from '@/lib/firebaseabc';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { imageBlob, userId } = await request.json();
  
  try {
    const storageRef = ref(storage, `images/${userId}/${Date.now()}.png`);
    await uploadBytes(storageRef, imageBlob);
    const imageUrl = await getDownloadURL(storageRef);
    
    return NextResponse.json({ imageUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Error uploading image' }, { status: 500 });
  }
}
