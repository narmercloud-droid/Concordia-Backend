type MessageBubbleProps = {
  text: string;
  sender: "user" | "ai";
};

export function MessageBubble({ text, sender }: MessageBubbleProps) {
  return (
    <div className={`mb-3 flex ${sender === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow ${sender === "user" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900"}`}>
        {text}
      </div>
    </div>
  );
}
