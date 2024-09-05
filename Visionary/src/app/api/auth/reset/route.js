import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';



export async function POST(request) {
  const { email, resetToken, newPassword } = await request.json();
  
  // Find user by email and reset token
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.resetToken !== resetToken || user.resetTokenExpiry < new Date()) {
    return new Response('Invalid or expired token', { status: 400 });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user with new password and clear reset token
  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return new Response('Password updated successfully', { status: 200 });
}
