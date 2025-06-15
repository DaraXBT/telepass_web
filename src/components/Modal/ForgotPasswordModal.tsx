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
import {
  requestPasswordReset,
} from "@/services/authservice.service";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  open,
  onClose,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const {toast} = useToast();
  const {t} = useLanguage();

  if (!open) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await requestPasswordReset(email);
      console.log("Response from requestPasswordReset:", response);
      if (response.status === 200) {
        toast({
          title: t("Success"),
          description: t("Please check your email for password reset instructions"),
        });
        onClose(); // Close the modal after successful request
      } else {
        toast({
          title: t("Error"),
          description: t("Email not found"),
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error in password reset request:", error);
      toast({
        title: t("Error"),
        description: error?.response?.data?.message || t("Failed to send reset email"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>{t("Forgot Password")}</CardTitle>
          <CardDescription>
            {t("Enter your email address to receive password reset instructions")}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                    t("Send Reset Email")
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
