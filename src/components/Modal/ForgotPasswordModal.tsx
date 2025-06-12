"use client";
import React, {useState} from "react";
import {useToast} from "@/hooks/use-toast";
import {useLanguage} from "@/components/providers/LanguageProvider";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {LoaderCircle} from "lucide-react";

type ForgotPasswordStep = "email" | "otp" | "newPassword";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  open,
  onClose,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [loading, setLoading] = useState(false);
  const {toast} = useToast();
  const {t} = useLanguage();

  if (!open) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await requestPasswordReset(email);
      if (response.status === 200) {
        toast({
          title: t("Success"),
          description: t("Password reset OTP has been sent to your email"),
        });
        setStep("otp");
      } else {
        toast({
          title: t("Error"),
          description: t("Email not found"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Failed to send reset OTP"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await verifyPasswordResetOtp(email, otp);
      if (response.status === 200) {
        toast({
          title: t("Success"),
          description: t("OTP verified successfully"),
        });
        setStep("newPassword");
      } else {
        toast({
          title: t("Error"),
          description: t("Invalid OTP"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Failed to verify OTP"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: t("Error"),
        description: t("Passwords do not match"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(email, otp, newPassword);
      if (response.status === 200) {
        toast({
          title: t("Success"),
          description: t(
            "Password reset successful. You can now log in with your new password."
          ),
        });
        onClose();
      } else {
        toast({
          title: t("Error"),
          description: t("Failed to reset password"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Failed to reset password"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderEmailStep = () => (
    <form onSubmit={handleEmailSubmit}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">{t("Email")}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={t("Enter your email address")}
            className="bg-background/80 backdrop-blur-sm"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            disabled={loading}>
            {t("Cancel")}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                {t("Sending...")}
              </>
            ) : (
              t("Continue")
            )}
          </Button>
        </div>
      </div>
    </form>
  );

  const renderOtpStep = () => (
    <form onSubmit={handleOtpVerify}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="otp">{t("OTP Code")}</Label>
          <Input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            placeholder={t("Enter OTP sent to your email")}
            className="bg-background/80 backdrop-blur-sm"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            type="button"
            onClick={() => setStep("email")}
            disabled={loading}>
            {t("Back")}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                {t("Verifying...")}
              </>
            ) : (
              t("Verify OTP")
            )}
          </Button>
        </div>
      </div>
    </form>
  );

  const renderNewPasswordStep = () => (
    <form onSubmit={handlePasswordReset}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="new-password">{t("New Password")}</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder={t("Enter new password")}
            className="bg-background/80 backdrop-blur-sm"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm-password">{t("Confirm Password")}</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder={t("Confirm new password")}
            className="bg-background/80 backdrop-blur-sm"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            type="button"
            onClick={() => setStep("otp")}
            disabled={loading}>
            {t("Back")}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                {t("Resetting...")}
              </>
            ) : (
              t("Reset Password")
            )}
          </Button>
        </div>
      </div>
    </form>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case "email":
        return renderEmailStep();
      case "otp":
        return renderOtpStep();
      case "newPassword":
        return renderNewPasswordStep();
      default:
        return renderEmailStep();
    }
  };

  const getTitleForStep = (): string => {
    switch (step) {
      case "email":
        return t("Forgot Password");
      case "otp":
        return t("Verify OTP");
      case "newPassword":
        return t("Reset Password");
      default:
        return t("Forgot Password");
    }
  };

  const getDescriptionForStep = (): string => {
    switch (step) {
      case "email":
        return t("Enter your email address to receive a password reset OTP");
      case "otp":
        return t("Enter the OTP sent to") + ` ${email}`;
      case "newPassword":
        return t("Create a new password for your account");
      default:
        return t("Enter your email address to receive a password reset OTP");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>{getTitleForStep()}</CardTitle>
          <CardDescription>{getDescriptionForStep()}</CardDescription>
        </CardHeader>
        <CardContent>{renderCurrentStep()}</CardContent>
      </Card>
    </div>
  );
}

// Password reset service functions
export const requestPasswordReset = async (email: string) => {
  // TODO: Implement actual API call
  const response = await fetch("/api/auth/request-password-reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({email}),
  });
  return {status: response.status, data: await response.json()};
};

export const verifyPasswordResetOtp = async (email: string, otp: string) => {
  // TODO: Implement actual API call
  const response = await fetch("/api/auth/verify-reset-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({email, otp}),
  });
  return {status: response.status, data: await response.json()};
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  // TODO: Implement actual API call
  const response = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({email, otp, newPassword}),
  });
  return {status: response.status, data: await response.json()};
};
