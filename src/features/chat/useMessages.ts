import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type Message = {
  id: string;
  body: string;
  sender_id: string | null;
  created_at: string;
};

export function useMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // initial load
    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at")
      .then(({ data }) => {
        if (data) setMessages(data);
      });

    // realtime subscribe
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`
        },
        payload => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  return messages;
}
