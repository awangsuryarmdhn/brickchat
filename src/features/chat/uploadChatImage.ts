import { supabase } from "@/lib/supabase";
import { resizeImage } from "@/lib/image";

export async function uploadChatImage(
  file: File,
  conversationId: string
): Promise<string> {
  const resized = await resizeImage(file);

  const filePath = `${conversationId}/${Date.now()}.jpg`;

  const { error } = await supabase.storage
    .from("chat-images")
    .upload(filePath, resized, {
      contentType: "image/jpeg"
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("chat-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
