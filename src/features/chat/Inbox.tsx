import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Avatar from "@/components/Avatar";
import { useInbox } from "./useInbox";
import type { Profile } from "./types";
import Header from "@/components/layout/Header";
import AppLayout from "@/components/layout/AppLayout";

type InboxProps = {
  userId: string;
  onSelect: (conversationId: string) => void;
};

export default function Inbox({ userId, onSelect }: InboxProps) {
  const conversations = useInbox(userId);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});

  useEffect(() => {
    async function loadProfiles() {
      const userIds = conversations.flatMap(c => [c.user_a, c.user_b]);
      const uniqueIds = Array.from(
        new Set(userIds.filter(id => id !== userId))
      );

      if (uniqueIds.length === 0) return;

      const { data } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", uniqueIds);

      if (!data) return;

      const map: Record<string, Profile> = {};
      data.forEach(profile => {
        map[profile.id] = profile;
      });

      setProfiles(map);
    }

    loadProfiles();
  }, [conversations, userId]);

    return (
    <AppLayout header={<Header title="Inbox" />}>
        {conversations.length === 0 && <p>No conversations</p>}

        {conversations.map(c => {
        const otherId = c.user_a === userId ? c.user_b : c.user_a;
        const profile = profiles[otherId];

        return (
            <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: 8,
                borderBottom: "1px solid #eee"
            }}
            >
            <Avatar
                url={profile?.avatar_url}
                name={profile?.username ?? "Unknown"}
            />
            <strong>{profile?.username ?? "Unknown"}</strong>
            </button>
        );
        })}
    </AppLayout>
    );
}
