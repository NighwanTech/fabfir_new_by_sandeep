import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginAdmin = async (email: string, password: string) => {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    throw new Error('Invalid email or password.');
  }

  const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password.');
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const token = jwt.sign(
    { adminId: admin.id, role: 'ADMIN' },
    secret,
    { expiresIn: '15d' }
  );

  return { token };
};
