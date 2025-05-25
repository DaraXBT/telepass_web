"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useLanguage} from "@/components/providers/LanguageProvider";
import {StarBackground} from "@/components/ui/star-background";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import {toast} from "@/hooks/use-toast";

export function RegisterForm() {
  const router = useRouter();
  const {t} = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); // Clear previous error

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({name, email, password}),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("Registration failed"));
      }

      toast({
        title: t("Registration Successful"),
        description: t("Your account has been created successfully."),
        variant: "success",
        duration: 3000,
      }); // Redirect to home page (which has login form) after successful registration
      router.push("/");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    setError("");

    try {
      // In a real implementation, you would redirect to Google OAuth
      toast({
        title: t("Google Authentication"),
        description: t("Connecting to Google..."),
        duration: 2000,
      });

      // Simulate API call
      setTimeout(() => {
        localStorage.setItem("token", "google-mock-token");
        router.push("/dashboard");
      }, 1500);
    } catch (error: any) {
      setError(t("Google registration failed. Please try again."));
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      {/* Star Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <StarBackground
          count={25}
          minSize={0.4}
          maxSize={0.8}
          opacity="opacity-60"
          color="text-primary/40"
        />
      </div>

      <div className="flex flex-col items-center w-full max-w-sm gap-6 relative z-10">
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
          <h1 className="text-2xl font-semibold">
            {t("Create f Account")}
          </h1>
        </div>

        {/* Single Card for Registration Form */}
        <Card className="w-full backdrop-blur-sm bg-card/80 border border-border/70 shadow-lg">
          <CardContent className="pt-6">
            <form onSubmit={handleRegister} className="grid gap-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="grid gap-2">
                <Label htmlFor="name">{t("Full Name")}</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder={t("Enter your full name")}
                  className="bg-background/80 backdrop-blur-sm"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t("Email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t("Enter your email")}
                  className="bg-background/80 backdrop-blur-sm"
                />
              </div>{" "}
              <div className="grid gap-2">
                <Label htmlFor="password">{t("Password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={t("Create a password")}
                  className="bg-background/80 backdrop-blur-sm"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 transition-all"
                disabled={isLoading}>
                {isLoading ? t("Creating account...") : t("Create Account")}
              </Button>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-2 text-xs text-muted-foreground">
                    {t("OR")}
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGoogleRegister}
                disabled={isLoading}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />{" "}
                </svg>{" "}
                {t("Register with Google")}{" "}
              </Button>
              {/* Sign in link */}
              <div className="text-center mt-3">
                <p className="text-sm text-muted-foreground">
                  {t("Already have an account?")}{" "}
                  <Link
                    href="/"
                    className="text-primary hover:underline font-medium">
                    {t("Sign in")}
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
