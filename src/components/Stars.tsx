import { Star } from "lucide-react";

/** Read-only star rating with partial stars (e.g. 4.6). */
export function Stars({
  rating,
  size = "h-3.5 w-3.5",
  reviews,
}: {
  rating: number;
  size?: string;
  reviews?: number;
}) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      <span className="inline-flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const fill = Math.max(0, Math.min(1, rating - i));
          return (
            <span key={i} className={`relative inline-block ${size}`}>
              <Star className={`absolute inset-0 ${size} text-gray-300`} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={`${size} max-w-none fill-brand-star text-brand-star`} />
              </span>
            </span>
          );
        })}
      </span>
      {reviews !== undefined && (
        <span className="ml-0.5 text-xs text-gray-600">
          {rating.toFixed(1)} ({reviews.toLocaleString("en-US")})
        </span>
      )}
    </span>
  );
}
