import NextAuth from 'next-auth';
import { authOptions } from '@/util/authOptions';

export const GET = (req, res) => NextAuth(authOptions)(req, res);
export const POST = (req, res) => NextAuth(authOptions)(req, res);
