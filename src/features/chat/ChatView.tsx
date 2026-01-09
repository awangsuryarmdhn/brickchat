import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useMessages } from "./useMessages";
import { uploadChatImage } from "./uploadChatImage";
import { compressImage } from "@/lib/compressImage";
import ChatLayout from "@/components/layout/ChatLayout";
import Header from "@/components/layout/Header";
import ImagePreview from "./ImagePreview";
import { encryptMessage } from "@/lib/crypto";

type Props = {
  conversationId: string;
  userId: string;
  onBack?: () => void;
};

/* ===== AVATAR ===== */
function Avatar({ name }: { name: string }) {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
      {name[0].toUpperCase()}
    </div>
  );
}

/* ===== PRIVATE KEY HELPER ===== */
function getMySecretKey(): Uint8Array {
  const raw = localStorage.getItem("brick_private_key");
  if (!raw) throw new Error("Private key not found");
  return new Uint8Array(JSON.parse(raw));
}

export default function ChatView({
  conversationId,
  userId,
  onBack
}: Props) {
  const {
    messages,
    appendMessage,
    updateMessageStatus
  } = useMessages(conversationId);

  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // ======================
  // SEND TEXT (ENCRYPTED)
  // ======================
  async function sendTextMessage() {
    if (!text.trim() || sending) return;

    setSending(true);
    const tempId = crypto.randomUUID();

    const mySecretKey = getMySecretKey();
    const myPublicKey = mySecretKey.slice(32);

    const encrypted = encryptMessage(
      text.trim(),
      myPublicKey,
      mySecretKey
    );

    appendMessage({
      id: tempId,
      conversation_id: conversationId,
      sender_id: userId,
      sender_type: "user",
      message_type: "encrypted",
      body: "[encrypted]",
      created_at: new Date().toISOString(),
      status: "sending"
    });

    setText("");

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: userId,
      sender_type: "user",
      message_type: "encrypted",
      body: JSON.stringify(encrypted)
    });

    updateMessageStatus(tempId, error ? "failed" : "sent");
    setSending(false);
  }

  // ======================
  // SEND IMAGE (PLAIN)
  // ======================
  async function handleImageUpload(file: File) {
    if (sending) return;

    setSending(true);
    const tempId = crypto.randomUUID();

    try {
      const compressed = await compressImage(file, {
        maxWidth: 1280,
        maxHeight: 1280,
        quality: 0.65
      });

      const imageUrl = await uploadChatImage(
        compressed,
        conversationId
      );

      appendMessage({
        id: tempId,
        conversation_id: conversationId,
        sender_id: userId,
        sender_type: "user",
        message_type: "image",
        body: imageUrl,
        created_at: new Date().toISOString(),
        status: "sending"
      });

      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: userId,
        sender_type: "user",
        message_type: "image",
        body: imageUrl
      });

      updateMessageStatus(
        tempId,
        error ? "failed" : "sent"
      );
    } catch {
      updateMessageStatus(tempId, "failed");
    } finally {
      setSending(false);
    }
  }

  // ======================
  // AUTO SCROLL
  // ======================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  return (
    <ChatLayout header={<Header title="Chat" onBack={onBack} />}>
      {/* CHAT LIST */}
      <div className="mx-auto flex max-w-xl flex-col gap-3 px-3 py-2">
        {messages.map(msg => {
          const isMe = msg.sender_id === userId;

          return (
            <div key={msg.id} className="flex items-end gap-2">
              {!isMe && <Avatar name="User" />}

              <div
                className={`rounded-2xl px-3 py-2 text-sm ${
                  isMe
                    ? "ml-auto bg-blue-600 text-white"
                    : "bg-white text-gray-900 shadow"
                }`}
                style={{ maxWidth: "70%" }}
              >
                {msg.message_type === "image" ? (
                  <a
                    href={msg.body}
                    target="_blank"
                    rel="noreferrer"
                    className="block max-w-[240px]"
                  >
                    <img
                      src={msg.body}
                      className="block max-h-60 w-full rounded-lg object-contain"
                    />
                  </a>
                ) : (
                  msg.body
                )}

                {isMe && msg.status && (
                  <div className="mt-1 text-[10px] opacity-70">
                    {msg.status === "sending" && "Sending…"}
                    {msg.status === "failed" && "Failed"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT BAR */}
      <div className="sticky bottom-0 border-t bg-white">
        <div className="mx-auto flex max-w-xl items-center gap-2 p-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type a message"
            disabled={sending}
            className="flex-1 rounded-full border px-4 py-2 text-sm"
          />

          <label className="cursor-pointer px-2 text-blue-600">
            📎
            <input
              type="file"
              hidden
              accept="image/*"
              disabled={sending}
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) setPreviewFile(file);
                e.currentTarget.value = "";
              }}
            />
          </label>

          <button
            onClick={sendTextMessage}
            disabled={sending}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm text-white"
          >
            Send
          </button>
        </div>
      </div>

      {/* IMAGE PREVIEW */}
      {previewFile && (
        <ImagePreview
          file={previewFile}
          onCancel={() => setPreviewFile(null)}
          onConfirm={async () => {
            await handleImageUpload(previewFile);
            setPreviewFile(null);
          }}
        />
      )}
    </ChatLayout>
  );
}
