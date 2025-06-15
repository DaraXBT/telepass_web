"use client";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {useLanguage} from "@/components/providers/LanguageProvider";
import {useState} from "react";

export default function OtpModal({
  open,
  onClose,
  onVerify,
  email,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  email: string;
  loading: boolean;
}) {
  const [otp, setOtp] = useState("");
  const {t} = useLanguage();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">{t("Verify OTP")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            {t("Enter the OTP sent to")}{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>{" "}
          <div className="mb-6 flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => onVerify(otp)}
              disabled={loading}>
              {loading ? t("Verifying...") : t("Verify")}
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              onClick={onClose}
              disabled={loading}>
              {t("Cancel")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
