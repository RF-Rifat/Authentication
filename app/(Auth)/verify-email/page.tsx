// app/verify-email/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VerifyEmail() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link");
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();
        if (response.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
        setMessage(data.message);
      } catch (error) {
        console.error("Error verifying email:", error);
        setStatus("error");
        setMessage("An unexpected error occurred");
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleContinue = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>
            {status === "loading"
              ? "Verifying Email"
              : status === "success"
              ? "Email Verified"
              : "Verification Failed"}
          </CardTitle>
          <CardDescription>
            {status === "loading"
              ? "Please wait while we verify your email..."
              : message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "loading" && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          )}
          {status === "success" && (
            <p className="text-center text-green-600">
              Your email has been successfully verified!
            </p>
          )}
          {status === "error" && (
            <p className="text-center text-red-600">
              There was an error verifying your email. Please try again or
              contact support.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {status !== "loading" && (
            <Button onClick={handleContinue}>Continue to Home Page</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
