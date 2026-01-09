type Props = {
  file: File;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ImagePreview({
  file,
  onConfirm,
  onCancel
}: Props) {
  const previewUrl = URL.createObjectURL(file);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50
      }}
    >
      <div
        style={{
          background: "white",
          padding: 16,
          borderRadius: 8,
          maxWidth: 320,
          width: "100%"
        }}
      >
        <img
          src={previewUrl}
          alt="preview"
          style={{ width: "100%", borderRadius: 6 }}
        />

        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 12
          }}
        >
          <button
            onClick={onCancel}
            style={{ flex: 1 }}
          >
            Batal
          </button>

          <button
            onClick={onConfirm}
            style={{ flex: 1 }}
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
}
