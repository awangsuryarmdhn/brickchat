import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useMessages } from "./useMessages";
import Header from "@/components/layout/Header";
import AppLayout from "@/components/layout/AppLayout";

type Props = {
  conversationId: string;
  userId: string;
};

export default function ChatView({ conversationId, userId }: Props) {
  const messages = useMessages(conversationId);
  const [text, setText] = useState("");

  async function sendMessage() {
    if (!text.trim()) return;

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: userId,
      body: text
    });

    setText("");
  }

  return (
    <AppLayout
      header={
        <Header
          title="Chat"
          onBack={() => window.location.reload()}
        />
      }
    >
      <div style={{ minHeight: "60vh" }}>
        {messages.map(msg => (
          <p key={msg.id}>
            <b>{msg.sender_id === userId ? "Me" : "Other"}:</b>{" "}
            {msg.body}
          </p>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ flex: 1 }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </AppLayout>
  );
}

