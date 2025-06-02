"use client";

import { LanguageToggler } from "@/components/language-toggler";
import RegisterForm from "@/components/register-form";
import { ThemeToggler } from "@/components/theme-toggler";
import { GalleryVerticalEnd } from "lucide-react";
import { useEffect, useState } from "react";

export default function RegisterPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }
  return (
    <div className="min-h-screen w-full flex flex-col antialiased bg-gradient-to-b from-background to-background/95 overflow-y-auto pb-16">
      <div className="flex flex-col flex-grow gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start relative z-10">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            TelePass
          </a>
        </div>
        <div className="flex flex-grow items-center justify-center py-6">
          <div className="w-full max-w-md">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="fixed bottom-5 right-4">
        <div className="flex items-center gap-2 relative z-10">
          <ThemeToggler />
          <LanguageToggler />
        </div>
      </div>
    </div>
  );
}
