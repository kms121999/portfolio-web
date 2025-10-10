import { getMessageById } from "@/app/actions/messageActions";
import ReadStatusToggle from "./ReadStatusToggle";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MessagePage({ params }: Props) {
  // const user = await stackServerApp.getUser({ or: 'throw' });

  const allParams = await params;
  const messageId = allParams.id;
  const message = await getMessageById(messageId);

  if (!message) return <p>Message not found.</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Message from {message.name}</h1>
      <p className="mb-2"><strong>Email:</strong> {message.email}</p>
      <p className="mb-4"><strong>Received:</strong> {message.createdAt.toLocaleString()}</p>
      <div className="mb-6 p-4 border rounded bg-gray-50">{message.message}</div>
      <ReadStatusToggle read={message.read} messageId={messageId} />
    </div>
  );
}
