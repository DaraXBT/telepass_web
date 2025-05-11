"use client";

import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useLanguage} from "@/components/providers/LanguageProvider";

export default function NotFound() {
  const router = useRouter();
  const {language, t} = useLanguage();
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
    const newStars = Array.from({length: 20}, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${0.5 + Math.random() * 0.5}rem`, // Varying sizes between 0.5rem and 1rem
      animationDelay: `${Math.random() * 5}s`,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden relative bg-gradient-to-b from-background to-background/95">
      {/* Stars animation */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute animate-twinkle opacity-60 text-primary/70"
          style={{
            top: star.top,
            left: star.left,
            fontSize: star.size,
            animationDelay: star.animationDelay,
          }}>
          ✧
        </div>
      ))}

      <div className="text-center space-y-8 max-w-md relative z-10">
        <div className="relative">
          <h1 className="text-7xl font-bold tracking-tighter text-foreground/90">
            <span>4</span>
            <span className="inline-block mx-1 relative">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs animate-pulse">
                🔨
              </span>
              <span className="inline-block animate-float text-primary">0</span>
              <span className="absolute -bottom-1 -right-2 text-xs animate-spin-slow">
                🚧
              </span>
            </span>
            <span>4</span>
          </h1>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent mt-4"></div>
        </div>

        <h2 className="text-xl font-medium text-foreground/80">
          {t("Page Not Found")}
        </h2>
        <p className="text-muted-foreground text-sm">
          {t(
            "Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place."
          )}
        </p>

        <div className="flex flex-row gap-4 justify-center pt-2">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="transition-all hover:shadow-sm">
            {t("Go Back")}
          </Button>
          <Button
            variant="default"
            asChild
            className={`bg-gradient-to-r from-primary/80 to-primary transition-all hover:shadow-md ${language === "km" ? "font-kantumruy" : ""}`}>
            <Link href="/dashboard">{t("Dashboard")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
