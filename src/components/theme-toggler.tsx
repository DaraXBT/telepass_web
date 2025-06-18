"use client";

import * as React from "react";
import {useTheme} from "next-themes";
import {Sun, Moon} from "lucide-react";
import {Button} from "@/components/ui/button";

export function ThemeToggler() {
  const {theme, setTheme} = useTheme();
  const [isAnimating, setIsAnimating] = React.useState(false);

  const toggleTheme = () => {
    setIsAnimating(true);

    // Start theme change after a longer delay for smoother transition
    setTimeout(() => {
      setTheme(theme === "light" ? "dark" : "light");
    }, 400);

    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 1200);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="transition-all duration-500 hover:scale-105">
      <div className="relative overflow-hidden">
        <Moon
          className={`h-[1.2rem] w-[1.2rem] text-black absolute transition-all duration-1000 ease-out transform ${
            theme === "light"
              ? `opacity-100 rotate-0 scale-100 ${isAnimating ? "rotate-180 scale-105" : ""}`
              : "opacity-0 rotate-180 scale-90"
          }`}
        />
        <Sun
          className={`h-[1.2rem] w-[1.2rem] text-white transition-all duration-1000 ease-out transform ${
            theme === "dark"
              ? `opacity-100 rotate-0 scale-100 ${isAnimating ? "rotate-180 scale-105" : ""}`
              : "opacity-0 rotate-180 scale-90"
          }`}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
