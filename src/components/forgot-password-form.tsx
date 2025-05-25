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
import {toast} from "@/hooks/use-toast";
import Link from "next/link";

export function ForgotPasswordForm() {
  const router = useRouter();
  const {t} = useLanguage();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // In a real implementation, you would call an API to send OTP
      // Simulating API call
      setTimeout(() => {
        toast({
          title: t("OTP Sent"),
          description: t("A verification code has been sent to your email."),
          duration: 3000,
        });
        setStep(2);
        setIsLoading(false);
      }, 1500);
    } catch (error: any) {
      setError(error.message || t("Failed to send verification code."));
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // In a real implementation, you would verify the OTP with an API
      // Simulating API call
      setTimeout(() => {
        const fullOtp = otp.join("");
        // For demo purposes, any 6-digit code is accepted
        if (fullOtp.length === 6 && /^\d+$/.test(fullOtp)) {
          toast({
            title: t("OTP Verified"),
            description: t(
              "Your identity has been verified. Please set a new password."
            ),
            duration: 3000,
          });
          setStep(3);
        } else {
          setError(t("Invalid verification code. Please try again."));
        }
        setIsLoading(false);
      }, 1500);
    } catch (error: any) {
      setError(error.message || t("Failed to verify code."));
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError(t("Passwords do not match."));
      return;
    }

    setIsLoading(true);

    try {
      // In a real implementation, you would call an API to reset the password
      // Simulating API call
      setTimeout(() => {
        toast({
          title: t("Password Reset Successful"),
          description: t("Your password has been reset successfully."),
          variant: "success",
          duration: 3000,
        });
        router.push("/"); // Redirect to login page
        setIsLoading(false);
      }, 1500);
    } catch (error: any) {
      setError(error.message || t("Failed to reset password."));
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleResendOTP = () => {
    setIsLoading(true);

    // Simulate sending a new OTP
    setTimeout(() => {
      toast({
        title: t("OTP Resent"),
        description: t("A new verification code has been sent to your email."),
        duration: 3000,
      });
      setIsLoading(false);
    }, 1500);
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
            {step === 1 && t("Forgot Password")}
            {step === 2 && t("Verify Identity")}
            {step === 3 && t("Reset Password")}
          </h1>
        </div>

        <Card className="w-full backdrop-blur-sm bg-card/80 border border-border/70 shadow-lg">
          <CardContent className="pt-6">
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {/* Step 1: Email Input */}
            {step === 1 && (
              <form onSubmit={handleRequestOTP} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("Email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={t("Enter your email")}
                    className="bg-background/80 backdrop-blur-sm border-input"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 transition-all"
                  disabled={isLoading}>
                  {isLoading ? t("Sending...") : t("Send Verification Code")}
                </Button>{" "}
                <div className="text-center mt-3">
                  <p className="text-sm text-muted-foreground">
                    {t("Remember your password?")}{" "}
                    <Link
                      href="/"
                      className="text-primary hover:underline font-medium">
                      {t("Back to Login")}
                    </Link>
                  </p>
                </div>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="grid gap-4">
                {" "}
                <p className="text-sm text-muted-foreground text-center">
                  {t("Enter the 6-digit verification code sent to")} {email}
                </p>
                <div className="flex justify-center gap-2 py-4">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-medium bg-background/80 backdrop-blur-sm border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      autoFocus={index === 0}
                      disabled={isLoading}
                    />
                  ))}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 transition-all"
                  disabled={isLoading || otp.join("").length !== 6}>
                  {isLoading ? t("Verifying...") : t("Verify Code")}
                </Button>{" "}
                <div className="flex justify-between items-center mt-3">
                  <p className="text-sm text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-primary hover:underline font-medium">
                      {t("Change Email")}
                    </button>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-primary hover:underline font-medium">
                      {t("Resend Code")}
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* Step 3: Set New Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="new-password">{t("New Password")}</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder={t("Enter new password")}
                    className="bg-background/80 backdrop-blur-sm border-input"
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">
                    {t("Confirm Password")}
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder={t("Confirm new password")}
                    className="bg-background/80 backdrop-blur-sm border-input"
                    disabled={isLoading}
                  />
                </div>{" "}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 transition-all"
                  disabled={isLoading}>
                  {isLoading ? t("Resetting...") : t("Reset Password")}
                </Button>
                <div className="text-center mt-3">
                  <p className="text-sm text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-primary hover:underline font-medium">
                      {t("Back to Verification")}
                    </button>
                  </p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
