import {NextRequest, NextResponse} from "next/server";
import {api} from "@/api/interceptor";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || (!body.googleId && !body.email)) {
      return NextResponse.json(
        {error: "Missing required Google identification data"},
        {status: 400}
      );
    }

    // Forward the request to your backend API
    try {
      const response = await api.post("/api/v1/admin/check-google-account", {
        googleId: body.googleId,
        email: body.email,
      });

      if (response.status === 200 && response.data) {
        // ✅ Improved: Handle the backend response structure properly
        return NextResponse.json({
          exists: true,
          ...response.data.payload, // Backend wraps data in payload
          message: response.data.message,
        });
      }

      // User doesn't exist
      return NextResponse.json({exists: false}, {status: 404});
    } catch (error: any) {
      // ✅ Improved: Better error handling for different status codes
      if (error.response?.status === 404) {
        return NextResponse.json(
          {exists: false, message: "Admin not found with Google credentials"},
          {status: 404}
        );
      }

      // Other API errors
      return NextResponse.json(
        {
          error:
            error.response?.data?.message || error.message || "User not found",
          exists: false,
        },
        {status: error.response?.status || 500}
      );
    }
  } catch (error: any) {
    console.error("Error checking Google account:", error);
    return NextResponse.json(
      {error: error.message || "Internal server error"},
      {status: 500}
    );
  }
}
