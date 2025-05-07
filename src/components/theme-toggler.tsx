"use client";

import * as React from "react";
import {useTheme} from "next-themes";
import {Sun, Moon} from "lucide-react";
import {Button} from "@/components/ui/button";

export function ThemeToggler() {
  const {theme, setTheme} = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {theme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-black" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-white" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
