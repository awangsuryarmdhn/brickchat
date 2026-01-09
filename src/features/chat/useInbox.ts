import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { InboxConversation } from "./types";

export function useInbox(userId: string) {
  const [conversations, setConversations] = useState<InboxConversation[]>([]);

  useEffect(() => {
    async function loadInbox() {
      const { data: convs } = await supabase
        .from("conversations")
        .select("id, user_a, user_b")
        .or(`user_a.eq.${userId},user_b.eq.${userId}`);

      if (!convs) return;

      const otherIds = convs.map(c =>
        c.user_a === userId ? c.user_b : c.user_a
      );

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", otherIds);

      const map = new Map<string, string>();
      profiles?.forEach(p => map.set(p.id, p.username));

      setConversations(
        convs.map(c => {
          const other =
            c.user_a === userId ? c.user_b : c.user_a;
          return {
            id: c.id,
            other_user_id: other,
            other_username: map.get(other) ?? "Unknown"
          };
        })
      );
    }

    loadInbox();
  }, [userId]);

  return conversations;
}
