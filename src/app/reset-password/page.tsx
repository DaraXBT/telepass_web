"use client";

import React, {useState, useEffect} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {Eye, EyeOff, CheckCircle, GalleryVerticalEnd} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {useLanguage} from "@/components/providers/LanguageProvider";
import {changePasswordWithToken} from "@/services/admin.service";
import {LanguageToggler} from "@/components/language-toggler";
import {ThemeToggler} from "@/components/theme-toggler";
import Image from "next/image";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {t} = useLanguage();
  const [isClient, setIsClient] = useState(false);

  // Get token from URL parameters
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const validatePasswords = () => {
    const newErrors: Record<string, string> = {};

    // Password validation
    if (!formData.newPassword) {
      newErrors.newPassword = t("New password is required");
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = t("Password must be at least 8 characters long");
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = t(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      );
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("Please confirm your password");
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t("Passwords do not match");
    }

    // Token validation
    if (!token) {
      newErrors.token = t("Invalid or missing reset token");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await changePasswordWithToken({
        token: token!,
        newPassword: formData.newPassword,
      });

      if (result.success) {
        setIsSuccess(true);
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        setErrors({
          submit:
            result.message || t("Failed to reset password. Please try again."),
        });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setErrors({
        submit: t("An error occurred. Please try again."),
      });
    } finally {
      setIsLoading(false);
    }
  }; // Success state
  if (isSuccess) {
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
            <div className="flex flex-col items-center w-full max-w-sm gap-6 relative z-10">
              {/* Logo and Title */}
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
                  {t("Password Reset Successfully!")}
                </h1>
              </div>

              {/* Success Card */}
              <Card className="w-full backdrop-blur-sm bg-card/80 border border-border/70 shadow-lg">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-center mb-4">
                      <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>

                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        {t(
                          "Your password has been reset successfully. You can now log in with your new password."
                        )}
                      </AlertDescription>
                    </Alert>

                    <div className="text-center text-muted-foreground">
                      <p>{t("Redirecting to login page...")}</p>
                    </div>

                    <Button
                      onClick={() => router.push("/")}
                      className="w-full bg-primary hover:bg-primary/90 transition-all"
                      variant="default">
                      {t("Go to Login Page")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
          <div className="flex flex-col items-center w-full max-w-sm gap-6 relative z-10">
            {/* Logo and Title */}
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
                {t("Reset Your Password")}
              </h1>
            </div>

            {/* Reset Password Card */}
            <Card className="w-full backdrop-blur-sm bg-card/80 border border-border/70 shadow-lg">
              <CardContent className="pt-6">
                {errors.token && (
                  <Alert className="mb-4" variant="destructive">
                    <AlertDescription>{errors.token}</AlertDescription>
                  </Alert>
                )}

                {errors.submit && (
                  <Alert className="mb-4" variant="destructive">
                    <AlertDescription>{errors.submit}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="grid gap-4">
                  {/* New Password */}
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">{t("New Password")}</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder={t("Enter your new password")}
                        className={`bg-background/80 backdrop-blur-sm pr-10 ${
                          errors.newPassword ? "border-red-500" : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground">
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-sm text-red-500">
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">
                      {t("Confirm New Password")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder={t("Confirm your new password")}
                        className={`bg-background/80 backdrop-blur-sm pr-10 ${
                          errors.confirmPassword ? "border-red-500" : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground">
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Password Requirements */}
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>{t("Password requirements:")}</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>{t("At least 8 characters long")}</li>
                      <li>{t("Contains uppercase and lowercase letters")}</li>
                      <li>{t("Contains at least one number")}</li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full mt-2 bg-primary hover:bg-primary/90 transition-all"
                    disabled={isLoading}>
                    {isLoading
                      ? t("Resetting Password...")
                      : t("Reset Password")}
                  </Button>

                  {/* Back to Login */}
                  <div className="text-center text-sm text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => router.push("/")}
                      className="text-primary hover:underline">
                      {t("Back to Login")}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
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
};

export default ResetPasswordPage;
