import { useState } from "react";

interface Props {
  onSend: (text: string) => void;
}

export default function ChatInput({ onSend }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="p-4 flex gap-3">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter a task..."
        className="flex-1 bg-[#0b1419] border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
      />
      <button
        onClick={handleSubmit}
        className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
      >
        Run
      </button>
    </div>
  );
}
