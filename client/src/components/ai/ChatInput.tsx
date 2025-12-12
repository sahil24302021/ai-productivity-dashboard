import { useState } from "react";

export default function ChatInput({
  onSend,
  isLoading,
}: {
  onSend: (text: string) => void;
  isLoading: boolean;
}) {
  const [text, setText] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
  <form onSubmit={submit} className="flex items-center gap-3">
      {/* Input */}
    <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask anything..."
        className="
      flex-1 rounded-[22px] border border-gray-200 bg-white 
      px-4 py-2.5 text-sm text-gray-800 
      shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition
          focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400
        "
      />

      {/* Send Button */}
    <button
        type="submit"
        disabled={isLoading}
        className="
      inline-flex items-center justify-center
      rounded-xl bg-indigo-600 px-4 py-2.5 
      text-sm font-medium text-white 
      shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition transform
      hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]
      disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {isLoading ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
