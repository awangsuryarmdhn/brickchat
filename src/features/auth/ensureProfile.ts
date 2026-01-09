import { supabase } from "@/lib/supabase";

export async function ensureProfile(user: {
  id: string;
  email?: string;
}) {
  const username = user.email?.split("@")[0] ?? "user";
  const avatarUrl = `https://api.dicebear.com/8.x/initials/svg?seed=${username}`;

  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (data) return;

  await supabase.from("profiles").insert({
    id: user.id,
    username,
    avatar_type: "generated",
    avatar_url: avatarUrl
  });
}
