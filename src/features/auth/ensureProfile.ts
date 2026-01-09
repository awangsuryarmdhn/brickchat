import { supabase } from "@/lib/supabase";
import { generateKeyPair } from "@/lib/crypto";


export async function ensureProfile(user: {
  id: string;
  email?: string;
}) {
  const username = user.email?.split("@")[0] ?? "user";
  const avatarUrl = `https://api.dicebear.com/8.x/initials/svg?seed=${username}`;
  const keys = generateKeyPair();
    // 🔐 simpan PRIVATE key di browser (RAHASIA)
    localStorage.setItem(
    "brick_private_key",
    JSON.stringify(Array.from(keys.secretKey))
    );

    // 🌍 simpan PUBLIC key ke database
    await supabase.from("profiles").update({
    public_key: Array.from(keys.publicKey).join(",")
    });

  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (data) return;

  await supabase.from("profiles").insert({
    is_username_set: false,
    id: user.id,
    username,
    avatar_type: "generated",
    avatar_url: avatarUrl
  });
}
