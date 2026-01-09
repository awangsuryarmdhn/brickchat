import { useInbox } from "./useInbox";

type Props = {
  userId: string;
  onSelect: (conversationId: string) => void;
};

function Avatar({ name }: { name: string }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
      {name[0].toUpperCase()}
    </div>
  );
}

export default function Inbox({ userId, onSelect }: Props) {
  const conversations = useInbox(userId);

  return (
    <div className="mx-auto max-w-xl px-4 py-4">
      <h2 className="mb-4 text-lg font-semibold">Inbox</h2>

      {conversations.length === 0 && (
        <p className="text-sm text-gray-500">Belum ada percakapan</p>
      )}

      <div className="space-y-2">
        {conversations.map(c => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className="flex w-full items-center gap-3 rounded-xl bg-white px-4 py-3 shadow hover:bg-gray-50"
          >
            <Avatar name={c.other_username} />
            <span className="text-sm font-medium">
              {c.other_username}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
