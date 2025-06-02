"use client";

import {Button} from "@/components/ui/button";
import {useEffect} from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-5xl font-bold tracking-tight">Oops!</h1>
        <h2 className="text-2xl font-semibold">Something went wrong</h2>
        <p className="text-muted-foreground">
          We apologize for the inconvenience. An error has occurred while
          processing your request. Our team has been notified and is working to
          resolve the issue.
        </p>
        <div className="pt-4">
          <Button onClick={() => reset()} size="lg">
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
