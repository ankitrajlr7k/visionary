import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';



export async function POST(request) {
  const { email, password, name } = await request.json();
  
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return new Response('User already exists', { status: 400 });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
       // Default role
    },
  });

  return new Response(JSON.stringify(user), { status: 201 });
}
