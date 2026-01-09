export type MessageType = "text" | "image" | "encrypted";
export type MessageStatus = "sending" | "sent" | "failed";

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: "user" | "bot";
  message_type: MessageType;
  body: string;
  created_at: string;
  status?: MessageStatus;
};

/* ===== INBOX ===== */
export type InboxConversation = {
  id: string;
  other_user_id: string;
  other_username: string;
};
