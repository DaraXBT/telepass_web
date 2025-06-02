"use client";

import { useEffect, useState } from "react";

type StarBackgroundProps = {
  count?: number;
  minSize?: number;
  maxSize?: number;
  opacity?: string;
  color?: string;
};

export function StarBackground({
  count = 30,
  minSize = 0.4,
  maxSize = 1,
  opacity = "opacity-60",
  color = "text-primary/40",
}: StarBackgroundProps) {
  const [stars, setStars] = useState<
    {
      id: number;
      top: string;
      left: string;
      size: string;
      animationDelay: string;
    }[]
  >([]);

  useEffect(() => {
    // Generate random stars with varying sizes for more visual interest
    const newStars = Array.from({ length: count }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${minSize + Math.random() * (maxSize - minSize)}rem`,
      animationDelay: `${Math.random() * 5}s`,
    }));
    setStars(newStars);
  }, [count, minSize, maxSize]);

  return (
    <>
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute animate-twinkle ${opacity} ${color}`}
          style={{
            top: star.top,
            left: star.left,
            fontSize: star.size,
            animationDelay: star.animationDelay,
            zIndex: 0,
          }}
        >
          ✧
        </div>
      ))}
    </>
  );
}