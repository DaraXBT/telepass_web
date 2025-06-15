import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {email} = body;

    if (!email) {
      return NextResponse.json({error: "Email is required"}, {status: 400});
    } // Make request to backend API
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const response = await fetch(
      `${backendUrl}/api/v1/admin/request-password-reset`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({username: email}),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {error: data.message || "Failed to send password reset request"},
        {status: response.status}
      );
    }

    return NextResponse.json({message: "Password reset OTP sent successfully"});
  } catch (error) {
    console.error("Request password reset error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
