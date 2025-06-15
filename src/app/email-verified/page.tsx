"use client";

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {CheckCircle} from "lucide-react";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

const EmailVerifiedPage = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Start countdown and redirect after 5 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleRedirectNow = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Email Verified Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your email has been verified successfully. You can now access all
              features of your account.
            </AlertDescription>
          </Alert>

          <div className="text-center text-muted-foreground">
            <p>You will be redirected to the login page in</p>
            <p className="text-2xl font-bold text-primary">{countdown}</p>
            <p>seconds</p>
          </div>

          <Button
            onClick={handleRedirectNow}
            className="w-full"
            variant="default">
            Go to Login Page Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerifiedPage;
