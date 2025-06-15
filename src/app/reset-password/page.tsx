"use client";

import React, {useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {Eye, EyeOff, Lock, CheckCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {useLanguage} from "@/components/providers/LanguageProvider";
import {changePasswordWithToken} from "@/services/admin.service";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {t} = useLanguage();

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
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {t("Password Reset Successfully!")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              className="w-full"
              variant="default">
              {t("Go to Login Page")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Lock className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            {t("Reset Your Password")}
          </CardTitle>
          <p className="text-muted-foreground">
            {t("Enter your new password below")}
          </p>
        </CardHeader>
        <CardContent>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t("New Password")}</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder={t("Enter your new password")}
                  className={errors.newPassword ? "border-red-500" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-500">{errors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
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
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("Resetting Password...") : t("Reset Password")}
            </Button>

            {/* Back to Login */}
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => router.push("/")}
                className="text-sm text-muted-foreground">
                {t("Back to Login")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
