'use client';

import { markAsRead, markAsUnread } from "@/app/actions/messageActions";
import { useState } from "react";

type Props = {
  messageId: string;
  read: boolean;
}

export default function ReadStatusToggle({ messageId, read: readProp }: Props) {
  const [read, setRead] = useState(readProp);
  const [isPending, setIsPending] = useState(false);


  // const user = useUser();

  const toggleRead = () => {
    if (isPending) return;
    setIsPending(true);

    if (read) {
      markAsUnread(messageId)
      .then(() => setRead(false))
      .finally(() => setIsPending(false));
    } else {
      markAsRead(messageId)
      .then(() => setRead(true))
      .finally(() => setIsPending(false));
    }
  };

  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-wait"
      onClick={toggleRead}
      disabled={isPending}
    >
      {read ? "Mark as Unread" : "Mark as Read"}
    </button>
  );
}
