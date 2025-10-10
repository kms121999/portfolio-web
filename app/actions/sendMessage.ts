'use server';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

type FormState = {
  success: boolean;
  error?: string;
}

export async function sendMessage(_prevState: FormState, data: FormData): Promise<FormState> {
  const name = data.get("name")?.toString().trim();
  const email = data.get("email")?.toString().trim();
  const message = data.get("message")?.toString().trim();

  if (!name || !email || !message) {
  return { success: false, error: "All fields are required." };
  }

  try {
    await prisma.message.create({ data: { name, email, message } });
    return { success: true };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error("Error sending message:", errorMessage);
    return { success: false, error: "Try again later" };
  }
}