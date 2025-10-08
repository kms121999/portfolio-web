'use server';

type DataStructure = {
  name: string;
  email: string;
  message: string;
}

type FormState = {
  success: boolean;
  error?: string;
}

export async function sendMessage(_prevState: FormState, data: FormData): Promise<FormState> {
  const parsedData: DataStructure = {
    name: data.get("name") as string,
    email: data.get("email") as string,
    message: data.get("message") as string,
  };

  console.log("Message received:", parsedData);

  await new Promise((resolve) => setTimeout(resolve, 3000));

  return { success: true };
}