import {api} from "@/api/interceptor";

interface SignInCredentials {
  username: string;
  password: string;
}

interface RegisterUserData {
  username: string;
  password: string;
  [key: string]: any;
}

interface PasswordResetRequest {
  email: string;
}

interface VerifyOtpRequest {
  email: string;
  otp: string;
}

interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export const signInUserBody = async (reqBody: SignInCredentials) => {
  try {
    const response = await api.post(`/api/v1/admin/login`, reqBody, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    console.log({response});
    return response;
  } catch (error: any) {
    console.error("Sign in error:", error);
    return error.response || error;
  }
};

export const registerUser = async (user: RegisterUserData) => {
  try {
    const response = await api.post(`/api/v1/admin/register`, user, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    console.log({response});
    return response;
  } catch (error: any) {
    console.error("Register error:", error);
    return error.response || error;
  }
};

export const getAdminByUsername = async (username: string) => {
  try {
    const response = await api.get(
      `/api/v1/admin/by-username?username=${encodeURIComponent(username)}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log({response});
    return response;
  } catch (error: any) {
    console.error("Get admin by username error:", error);
    return error.response || error;
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    // Try different possible endpoint structures
    const response = await api.post(
      `/api/v1/admin/forgot-password?email=${encodeURIComponent(email)}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );
    console.log({response});
    return response;
  } catch (error: any) {
    console.error("Request password reset error:", error);
    return error.response || error;
  }
};

export const verifyPasswordResetOtp = async (email: string, otp: string) => {
  try {
    const response = await api.post(
      `/api/v1/admin/verify-reset-otp`,
      {email, otp},
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );
    console.log({response});
    return response;
  } catch (error: any) {
    console.error("Verify password reset OTP error:", error);
    return error.response || error;
  }
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  try {
    const response = await api.post(
      `/api/v1/admin/reset-password`,
      {email, otp, newPassword},
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );
    console.log({response});
    return response;
  } catch (error: any) {
    console.error("Reset password error:", error);
    return error.response || error;
  }
};
