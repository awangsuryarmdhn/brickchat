type Props = {
  url?: string | null;
  name: string;
  size?: number;
};

export default function Avatar({ url, name, size = 40 }: Props) {
  const fallback = name.charAt(0).toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        background: "#e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600
      }}
    >
      {url ? (
        <img src={url} width={size} height={size} alt={name} />
      ) : (
        fallback
      )}
    </div>
  );
}
