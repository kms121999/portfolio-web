import Link from "next/link";
import { getAllMessages } from "../actions/messageActions";

export default async function DashboardPage() {
  const messages = await getAllMessages();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Read</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => (
            <tr key={msg.id} className="border-b">
              <td className="p-2">{msg.name}</td>
              <td className="p-2">{msg.email}</td>
              <td className="p-2">{msg.read ? "✅" : "❌"}</td>
              <td className="p-2">
                <Link
                  href={`/dashboard/message/${msg.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
