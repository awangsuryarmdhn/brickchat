import { useState } from "react";
import { searchUsers } from "./searchUsers";
import { getOrCreateConversation } from "./getOrCreateConversation";

type Props = {
  currentUserId: string;
  onStart: (conversationId: string) => void;
};

export default function StartChat({ currentUserId, onStart }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { id: string; username: string }[]
  >([]);

  async function handleSearch() {
    if (!query.trim()) return;
    setResults(await searchUsers(query));
  }

  async function handleStart(userId: string) {
    const id = await getOrCreateConversation(currentUserId, userId);
    onStart(id);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-4">
      <h2 className="mb-3 text-lg font-semibold">Mulai Chat</h2>

      <div className="mb-3 flex gap-2">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Cari username…"
          className="flex-1 rounded-lg border px-3 py-2 text-sm"
        />
        <button
          onClick={handleSearch}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
        >
          Cari
        </button>
      </div>

      {results.map(u => (
        <button
          key={u.id}
          onClick={() => handleStart(u.id)}
          className="mb-2 flex w-full items-center gap-3 rounded-lg bg-white px-3 py-2 shadow hover:bg-gray-50"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-xs font-bold">
            {u.username[0].toUpperCase()}
          </div>
          <span>{u.username}</span>
        </button>
      ))}
    </div>
  );
}
