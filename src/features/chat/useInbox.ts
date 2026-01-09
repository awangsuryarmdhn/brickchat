import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Conversation } from "./types";

export function useInbox(userId: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    async function loadInbox() {
      const { data } = await supabase
        .from("conversations")
        .select("*")
        .or(`user_a.eq.${userId},user_b.eq.${userId}`);

      if (data) setConversations(data);
    }

    loadInbox();
  }, [userId]);

  return conversations;
}
