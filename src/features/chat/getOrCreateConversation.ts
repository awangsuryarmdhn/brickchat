import { supabase } from "@/lib/supabase";
import { sendBotMessage } from "./sendBotMessage";

export async function getOrCreateConversation(
  userA: string,
  userB: string
): Promise<string> {
  const [a, b] = userA < userB ? [userA, userB] : [userB, userA];

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_a", a)
    .eq("user_b", b)
    .single();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("conversations")
    .insert({ user_a: a, user_b: b })
    .select("id")
    .single();

  if (error || !created) {
    throw new Error("Failed to create conversation");
  }

  const conversationId = created.id;

  await sendBotMessage(
    conversationId,
    "👋 Welcome to BRICK!\n\nThis is a private chat. Messages are realtime and secure."
  );

  return conversationId;
}
