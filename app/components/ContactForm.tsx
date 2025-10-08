"use client";

import React, { useActionState, useEffect, useState } from "react";
import { sendMessage } from "../actions/sendMessage";
import toast from "react-hot-toast";

type ContactFormProps = {
  onSubmit: () => void;
};

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(sendMessage, {success: false});
  const [dots, setDots] = useState(0);

  // Handle success and error states
  useEffect(() => {
    if (state.success) {
      toast.success("Message sent!");
      onSubmit();
    } else if (state.error) {
      toast.error(`Error: ${state.error}`);
    }
  }, [state, onSubmit]);

  // Animate dots
  useEffect(() => {
    if (!isPending) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev < 3 ? prev + 1 : 0));
    }, 500);
    return () => clearInterval(interval);
  }, [isPending]);

  return (
    <>
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Send Me a Message</h2>
      <form className="space-y-6 flex flex-col" action={formAction}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          disabled={isPending}
          className={`
            w-full rounded-xl border border-gray-300 px-4 py-3
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${isPending ? "opacity-50 cursor-wait" : ""}`}
        />
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          disabled={isPending}
          className={`
            w-full rounded-xl border border-gray-300 px-4 py-3
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${isPending ? "opacity-50 cursor-wait" : ""}`}
        />
        <textarea
          name="message"
          rows={5}
          placeholder="Your message..."
          disabled={isPending}
          className={`
            w-full rounded-xl border border-gray-300 px-4 py-3
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${isPending ? "opacity-50 cursor-wait" : ""}`}
        />
        <button
          type="submit"
          disabled={isPending}
          className={`
            px-8 py-3 rounded-2xl bg-blue-600 min-w-[172px]
            text-white font-medium
            hover:bg-blue-700 transition
            ${isPending ? "opacity-50 cursor-wait" : "cursor-submit"}`}
        >
          {isPending ? (
            <>
              Sending
              <span className="inline-block font-large w-4 text-left">
                {".".repeat(dots)}
              </span>
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </>
  );
}
