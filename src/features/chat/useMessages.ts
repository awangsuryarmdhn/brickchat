import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Message, MessageStatus } from "./types";

export function useMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  // ======================
  // LOAD AWAL
  // ======================
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (data) setMessages(data);
    }

    load();
  }, [conversationId]);

  // ======================
  // REALTIME
  // ======================
  useEffect(() => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`
        },
        payload => {
          const incoming = payload.new as Message;

          setMessages(prev => {
            // cegah duplikasi pesan optimistic
            if (prev.find(m => m.id === incoming.id)) {
              return prev;
            }
            return [...prev, incoming];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // ======================
  // OPTIMISTIC APPEND
  // ======================
  function appendMessage(msg: Message) {
    setMessages(prev => [...prev, msg]);
  }

  // ======================
  // UPDATE STATUS
  // ======================
  function updateMessageStatus(
    tempId: string,
    status: MessageStatus
  ) {
    setMessages(prev =>
      prev.map(m =>
        m.id === tempId ? { ...m, status } : m
      )
    );
  }

  return {
    messages,
    appendMessage,
    updateMessageStatus
  };
}
