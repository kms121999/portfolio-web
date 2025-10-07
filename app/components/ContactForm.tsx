"use client";

import React, { useState } from "react";


export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You can add your form submission logic here
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
      <h2 className="text-3xl font-bold mb-6">Send Me a Message</h2>
      <form className="space-y-6">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="message"
          rows={5}
          placeholder="Your message..."
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-8 py-3 rounded-2xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}