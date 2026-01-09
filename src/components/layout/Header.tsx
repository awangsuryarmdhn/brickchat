type Props = {
  title: string;
  onBack?: () => void;
};

export default function Header({ title, onBack }: Props) {
  return (
    <header
      style={{
        padding: "12px 16px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        gap: 8
      }}
    >
      {onBack && (
        <button onClick={onBack}>&larr;</button>
      )}
      <h3 style={{ margin: 0 }}>{title}</h3>
    </header>
  );
}
