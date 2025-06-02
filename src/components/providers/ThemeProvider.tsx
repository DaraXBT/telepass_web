"use client";

import {useEffect, useState} from "react";
import {ThemeProvider as NextThemeProvider} from "next-themes";

export function ThemeProvider({children}: {children: React.ReactNode}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render nothing on the server
    return null;
  }

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange>
      {children}
    </NextThemeProvider>
  );
}
