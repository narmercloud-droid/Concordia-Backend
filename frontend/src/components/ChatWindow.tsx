"use client";

import { useEffect, useRef, useState } from "react";
import { aiClient } from "../lib/aiClient.js";
import { MessageBubble } from "./MessageBubble.js";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", sender: "ai", text: "Hi there! Ask me anything about the menu or place an order." }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const appendMessage = (message: Message) => {
    setMessages(current => [...current, message]);
  };

  const streamReply = (text: string) => {
    setTyping(true);
    let index = 0;
    const id = `stream-${Date.now()}`;
    appendMessage({ id, sender: "ai", text: "" });

    const interval = window.setInterval(() => {
      index += 1;
      setMessages(current =>
        current.map(msg =>
          msg.id === id ? { ...msg, text: text.slice(0, index) } : msg
        )
      );

      if (index >= text.length) {
        window.clearInterval(interval);
        setTyping(false);
      }
    }, 25);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;

    appendMessage({ id: `user-${Date.now()}`, sender: "user", text: input.trim() });
    const messageText = input.trim();
    setInput("");
    setTyping(true);

    try {
      const { reply } = await aiClient.sendMessage("guest", messageText);
      streamReply(reply || "Sorry, I couldn't respond right now.");
    } catch (error) {
      setTyping(false);
      appendMessage({ id: `error-${Date.now()}`, sender: "ai", text: "There was an error sending your message." });
    }
  };

  return (
    <div className="flex h-[70vh] flex-col rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-semibold">AI Chat</h2>
          <p className="text-sm text-slate-500">Ask questions about the menu and orders.</p>
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto pr-2">
        {messages.map(message => (
          <MessageBubble key={message.id} sender={message.sender} text={message.text} />
        ))}
        {typing && <div className="text-sm text-slate-500">AI is typing...</div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          placeholder="Type a message..."
        />
        <button className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}
