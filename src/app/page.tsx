"use client";

import {useEffect, useState} from "react";
import {GalleryVerticalEnd} from "lucide-react";
import {LoginForm} from "@/components/login-form";
import { ThemeToggler } from "@/components/ThemeToggler";

export default function LoginPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="grid min-h-screen antialiased">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Te\ePass
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="absolute bottom-5 right-4 text-white">
        <ThemeToggler />
      </div>
    </div>
  );
}
