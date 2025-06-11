import {NextRequest, NextResponse} from "next/server";
import {api} from "@/api/inteceptor";

export async function POST(request: NextRequest) {
  try {
    const googleData = await request.json();

    if (!googleData || !googleData.googleId || !googleData.email) {
      return NextResponse.json(
        {error: "Missing required Google authentication data"},
        {status: 400}
      );
    }

    // Check if admin already exists with this Google ID or email
    let existingAdmin;
    try {
      // ✅ Fixed: Use the correct backend endpoint
      const response = await api.post("/api/v1/admin/check-google-account", {
        googleId: googleData.googleId,
        email: googleData.email,
      });

      if (response.status === 200 && response.data) {
        existingAdmin = response.data;
      }
    } catch (error) {
      // Admin not found, continue to registration
      console.log("Admin not found with Google credentials");
    }

    if (existingAdmin) {
      // Admin exists, return their data
      // ✅ Fixed: Handle the backend response structure properly
      return NextResponse.json({
        ...existingAdmin.payload, // Backend wraps data in payload
        message: existingAdmin.message,
      });
    }

    // Register a new admin with Google data
    const adminData = {
      username:
        googleData.email.split("@")[0] || `google_${googleData.googleId}`,
      googleId: googleData.googleId,
      email: googleData.email,
      fullName: googleData.name,
      profileImage: googleData.image,
      password:
        Math.random().toString(36).slice(-10) +
        Math.random().toString(36).slice(-2),
      isGoogleAccount: true,
      // ✅ Removed: Backend doesn't expect role field
    };

    const registerResponse = await api.post(
      "/api/v1/admin/register",
      adminData
    );

    // ✅ Fixed: Backend returns 200 for successful registration
    if (registerResponse.status === 200) {
      // Successfully registered admin
      // ✅ Fixed: Handle the backend response structure properly
      return NextResponse.json({
        ...registerResponse.data.payload, // Backend wraps data in payload
        message: registerResponse.data.message,
      });
    }

    return NextResponse.json(
      {error: "Failed to register admin with Google credentials"},
      {status: registerResponse.status || 500}
    );
  } catch (error: any) {
    console.error("Google admin registration error:", error);
    return NextResponse.json(
      {error: error.message || "Internal server error"},
      {status: 500}
    );
  }
}
