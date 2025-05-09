"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useLanguage} from "@/components/providers/LanguageProvider";

export function LoginForm() {
  const router = useRouter();
  const {t} = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); // Clear previous error

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("Login failed"));
      }

      // Store token (if required)
      localStorage.setItem("token", data.token);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm gap-6">
      {/* Logo and Title without border */}
      <div className="flex flex-col items-center w-full">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-primary flex items-center justify-center bg-border">
          <Image
            src="/assets/images/logo.jpg"
            width={70}
            height={70}
            alt="TelePass Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-2xl font-semibold">{t("Login to TelePass")}</h1>
      </div>

      {/* Single Card for Email, Password and Button */}
      <Card className="w-full">
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="grid gap-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="grid gap-2">
              <Label htmlFor="email">{t("Email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t("Enter your email")}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">{t("Password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={t("Enter your password")}
              />
            </div>

            <Button type="submit" className="w-full mt-2">
              {t("Sign in")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
