import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {email, otp} = body;

    if (!email || !otp) {
      return NextResponse.json(
        {error: "Email and OTP are required"},
        {status: 400}
      );
    }

    // Make request to backend API
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const response = await fetch(`${backendUrl}/api/v1/admin/validate-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({username: email, otp}),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {error: data.message || "Failed to verify OTP"},
        {status: response.status}
      );
    }

    return NextResponse.json({message: "OTP verified successfully"});
  } catch (error) {
    console.error("Verify reset OTP error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
