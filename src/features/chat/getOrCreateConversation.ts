import { supabase } from "@/lib/supabase";

/**
 * Ambil conversation jika sudah ada,
 * atau buat baru jika belum.
 * Idempotent & aman dipanggil berulang.
 */
export async function getOrCreateConversation(
  userA: string,
  userB: string
): Promise<string> {
  // pastikan urutan konsisten (hindari duplicate)
  const [a, b] = userA < userB ? [userA, userB] : [userB, userA];

  // 1. coba ambil conversation existing
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_a", a)
    .eq("user_b", b)
    .single();

  if (existing) return existing.id;

  // 2. jika belum ada, buat baru
  const { data: created, error } = await supabase
    .from("conversations")
    .insert({
      user_a: a,
      user_b: b
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return created.id;
}
