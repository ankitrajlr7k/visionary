import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import crypto from 'crypto';


export async function POST(request) {
  const { email } = await request.json();
  
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return new Response('User not found', { status: 404 });
  }

  // Generate a password reset token
  const resetToken = crypto.randomBytes(4).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

  // Save reset token and expiry to the user
  await prisma.user.update({
    where: { email },
    data: { resetToken, resetTokenExpiry },
  });

  // Send reset email
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: 'your-email@example.com',
    to: email,
    subject: 'Password Reset',
    text: `You requested a password reset. Please use the following token to reset your password: ${resetToken}`,
  });

  return new Response('Reset email sent', { status: 200 });
}
