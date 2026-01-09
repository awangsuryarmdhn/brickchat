type Props = {
  children: React.ReactNode;
};

export default function Container({ children }: Props) {
  return (
    <div
      style={{
        maxWidth: 420,
        margin: "0 auto",
        minHeight: "100vh",
        borderLeft: "1px solid #e5e7eb",
        borderRight: "1px solid #e5e7eb"
      }}
    >
      {children}
    </div>
  );
}
