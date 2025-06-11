"use client";
import {useLanguage} from "@/components/providers/LanguageProvider";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {StarBackground} from "@/components/ui/star-background";
import {useToast} from "@/hooks/use-toast";
import {signIn} from "next-auth/react";
import Image from "next/image";
import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import ForgotPasswordModal from "@/components/Modal/ForgotPasswordModal";
import {Eye, EyeOff} from "lucide-react";

const SigninPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const router = useRouter();
  const {t} = useLanguage();
  const {toast} = useToast();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: t("Error"),
          description: t("Invalid username or password"),
          variant: "destructive",
        });
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("An error occurred during sign in"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="relative z-10 overflow-hidden">
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
                {t("Login to TelePass")}
              </h1>
            </div>

            {/* Single Card for Username, Password and Button */}
            <Card className="w-full backdrop-blur-sm bg-card/80 border border-border/70 shadow-lg">
              <CardContent className="pt-6">
                <form onSubmit={handleLogin} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">{t("Username")}</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder={t("Enter your username")}
                      className="bg-background/80 backdrop-blur-sm"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">{t("Password")}</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder={t("Enter your password")}
                        className="bg-background/80 backdrop-blur-sm pr-10"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground">
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setShowForgotPasswordModal(true)}
                        className="text-xs text-primary hover:underline">
                        {t("Forgot password?")}
                      </button>
                    </div>
                  </div>{" "}
                  <Button
                    type="submit"
                    className="w-full mt-2 bg-primary hover:bg-primary/90 transition-all"
                    disabled={loading}>
                    {loading ? t("Signing in...") : t("Sign in")}
                  </Button>
                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/50"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="px-2 text-muted-foreground bg-card">
                        {t("Or continue with")}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => signIn("google", {callbackUrl})}>
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      xmlns="http://www.w3.org/2000/svg">
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path
                          fill="#4285F4"
                          d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                        />
                        <path
                          fill="#34A853"
                          d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                        />
                        <path
                          fill="#EA4335"
                          d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                        />
                      </g>
                    </svg>
                    Sign in with Google
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    {t("Don't have an account?")}{" "}
                    <a
                      href="/register"
                      className="text-primary hover:underline">
                      {t("Register")}
                    </a>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <ForgotPasswordModal
        open={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />
    </>
  );
};

export default SigninPage;
