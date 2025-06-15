import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {email, otp, newPassword} = body;

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        {error: "Email, OTP, and new password are required"},
        {status: 400}
      );
    } // Make request to backend API
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const response = await fetch(`${backendUrl}/api/v1/admin/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({username: email, otp, newPassword}),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {error: data.message || "Failed to reset password"},
        {status: response.status}
      );
    }

    return NextResponse.json({message: "Password reset successfully"});
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
