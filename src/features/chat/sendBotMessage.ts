import { supabase } from "@/lib/supabase";

/**
 * Kirim pesan system / bot ke conversation
 */
export async function sendBotMessage(
  conversationId: string,
  text: string
) {
  await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_type: "bot",
    sender_id: null,
    body: text
  });
}
