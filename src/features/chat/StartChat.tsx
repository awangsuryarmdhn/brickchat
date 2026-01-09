import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { getOrCreateConversation } from "./getOrCreateConversation";

type Props = {
  currentUserId: string;
  onStart: (conversationId: string) => void;
};

export default function StartChat({ currentUserId, onStart }: Props) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  async function handleStart() {
    setError("");

    const { data: user } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();

    if (!user) {
      setError("User not found");
      return;
    }

    const conversationId = await getOrCreateConversation(
      currentUserId,
      user.id
    );

    onStart(conversationId);
  }

  return (
    <section style={{ padding: 24 }}>
      <h3>Start New Chat</h3>

      <input
        placeholder="username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <button onClick={handleStart}>Start</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </section>
  );
}
