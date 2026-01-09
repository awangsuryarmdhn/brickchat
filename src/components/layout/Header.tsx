type Props = {
  title: string;
  onBack?: () => void;
};

export default function Header({ title, onBack }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {onBack && (
        <button
          onClick={onBack}
          className="text-sm text-blue-600"
        >
          ← Back
        </button>
      )}
      <h1 className="text-base font-semibold">
        {title}
      </h1>
    </div>
  );
}
