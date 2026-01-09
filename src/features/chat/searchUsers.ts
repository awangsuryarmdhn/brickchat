import { supabase } from "@/lib/supabase";

export type SearchUser = {
  id: string;
  username: string;
  avatar_url: string | null;
};

export async function searchUsers(query: string): Promise<SearchUser[]> {
  if (!query.trim()) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, avatar_url")
    .ilike("username", `%${query}%`)
    .limit(5);

  if (error) {
    console.error("Search error:", error);
    return [];
  }

  return data ?? [];
}
