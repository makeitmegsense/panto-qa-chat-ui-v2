interface Props {
  message: {
    role: "user" | "agent";
    content: string;
  };
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div>
      <div
        className={`px-4 py-3 rounded-lg ${
          isUser
            ? "bg-yellow-400/10 text-yellow-300 border border-yellow-400/20"
            : "text-gray-200"
        } whitespace-pre-line`}
      >
        {message.content}
      </div>
    </div>
  );
}