import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/useAuth";
import { ensureProfile } from "@/features/auth/ensureProfile";
import Inbox from "@/features/chat/Inbox";
import ChatView from "@/features/chat/ChatView";
import StartChat from "@/features/chat/StartChat";
import Login from "@/features/auth/Login";

export default function App() {
  const { user, loading } = useAuth();
  const [activeConversation, setActiveConversation] =
    useState<string | null>(null);

  useEffect(() => {
    if (user) ensureProfile(user);
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Login />;

  if (!activeConversation) {
    return (
      <>
        <StartChat
          currentUserId={user.id}
          onStart={setActiveConversation}
        />
        <Inbox
          userId={user.id}
          onSelect={setActiveConversation}
        />
      </>
    );
  }

  return (
    <ChatView
      conversationId={activeConversation}
      userId={user.id}
    />
  );
}
