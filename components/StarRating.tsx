"use client";
import { Star } from "lucide-react";

export function StarRating({
  value,
  onChange,
  readOnly = false,
  size = "h-6 w-6",
}: {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n)}
          className={readOnly ? "cursor-default" : "cursor-pointer"}
        >
          <Star
            className={`${size} transition-colors ${
              n <= value ? "fill-[#d4890a] text-[#d4890a]" : "text-[#d8d2c4]"
            }`}
          />
        </button>
      ))}
    </div>
  );
}