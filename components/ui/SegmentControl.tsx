"use client";

interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export default function SegmentControl<T extends string>({
  options,
  value,
  onChange,
  className = "",
}: SegmentControlProps<T>) {
  return (
    <div
      className={`flex rounded-xl p-1 ${className}`}
      style={{ background: "#E5E5EA" }}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="flex-1 py-1.5 rounded-[10px] text-sm font-semibold transition-all"
          style={{
            background: value === opt.value ? "#FFFFFF" : "transparent",
            color: value === opt.value ? "#1C1C1E" : "#8E8E93",
            boxShadow:
              value === opt.value
                ? "0 1px 3px rgba(0,0,0,0.12)"
                : "none",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
