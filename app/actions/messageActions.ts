'use server';

import canReadWrite from '@/lib/canReadWrite';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function markAsRead(id: string) {
  if (await canReadWrite()) {
    return await prisma.message.update({
      where: { id },
      data: { read: true },
    });
  } else {
    throw new Error("403: User is unauthorized");
  }
}

export async function markAsUnread(id: string) {
  if (await canReadWrite()) {
    return await prisma.message.update({
      where: { id },
      data: { read: false },
    });
  } else {
    throw new Error("403: User is unauthorized");
  }
}

export async function getAllMessages() {
  if (await canReadWrite()) {
    return await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });
  } else {
    throw new Error("403: User is unauthorized");
  }
}

export async function getMessageById(id: string) {
  if (await canReadWrite()) {
    return await prisma.message.findUnique({ where: { id } });
  } else {
    throw new Error("403: User is unauthorized");
  }
}
