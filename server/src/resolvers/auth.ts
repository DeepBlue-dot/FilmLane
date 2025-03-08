import { MutationResolvers } from '../types.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthenticationError } from '@apollo/server';
import { JwtUserPayload } from '../types.js';

export const authResolvers: MutationResolvers = {
  signUp: async (_, { email, password }, { prisma }) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash: hashedPassword }
    });

    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '1h' }
    );

    return { token, user };
  },

  login: async (_, { email, password }, { prisma }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AuthenticationError('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AuthenticationError('Invalid credentials');

    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '1h' }
    );

    return { token, user };
  }
};