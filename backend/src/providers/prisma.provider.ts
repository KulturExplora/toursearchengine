import { prisma } from '../db/prisma.js';

import type { User } from '@prisma/client';
import { PublicUser, ServiceResponse } from '../types/types.js';

import { handlePrismaRequestError } from '../utils/errorHandler.js';

export const PrismaProvider = {
  client: prisma,

  async createUser(userData: {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
  }): Promise<ServiceResponse<User>> {
    try {
      const user = await prisma.user.create({
        data: userData,
      });

      return { success: true, data: user as User };
    } catch (error) {
      return handlePrismaRequestError(error, 'creating user', 'PrismaProvider');
    }
  },

  async createSubscriber(email: string): Promise<ServiceResponse<{ id: string; email: string }>> {
    try {
      const subscriber = await prisma.betaSubscribers.create({
        data: { email },
      });

      return { success: true, data: { id: subscriber.id, email: subscriber.email } };
    } catch (error) {
      return handlePrismaRequestError(error, 'creating user', 'PrismaProvider');
    }
  },

  async getUsers(
    limit: number = 20,
    cursor?: string,
  ): Promise<
    ServiceResponse<{
      users: PublicUser[];
      nextCursor: string | null;
    }>
  > {
    try {
      const safeLimit = Math.max(1, Math.min(limit, 100));

      const users = await prisma.user.findMany({
        take: safeLimit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { id: 'asc' },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      const nextCursor = users.length === safeLimit ? users[users.length - 1].id : null;

      return { success: true, data: { users, nextCursor } };
    } catch (error) {
      return handlePrismaRequestError(error, 'fetching users', 'AdminService');
    }
  },

  async getUserById(userId: string): Promise<ServiceResponse<PublicUser>> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return { success: false, error: 'User not found.' };
      }

      return { success: true, data: { id: user.id, name: user.name, email: user.email } };
    } catch (error) {
      return handlePrismaRequestError(error, 'fetching user by ID', 'AdminService');
    }
  },

  async deleteUserById(userId: string): Promise<ServiceResponse<null>> {
    try {
      await prisma.user.delete({ where: { id: userId } });

      return { success: true, data: null };
    } catch (error) {
      return handlePrismaRequestError(error, 'deleting user', 'AdminService');
    }
  },
};
