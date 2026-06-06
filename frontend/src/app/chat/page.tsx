"use client";

import ChatWindow from "../../components/ChatWindow.js";

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">AI ordering assistant</h1>
        <p className="mt-2 text-slate-600">Ask the agent to recommend dishes, apply discounts, or build an order for you.</p>
      </div>
      <ChatWindow />
    </div>
  );
}
