type Props = {
  header: React.ReactNode;
  children: React.ReactNode;
};

export default function ChatLayout({ header, children }: Props) {
  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* HEADER / NAVBAR */}
      <div className="sticky top-0 z-10 border-b bg-white">
        {header}
      </div>

      {/* CHAT CONTENT */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
