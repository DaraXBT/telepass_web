import { api } from "@/api/inteceptor";

export const signInUserBody = async (reqBody) => {
  try {
    const response = await api.post(`/api/v1/admin/login`, reqBody, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    console.log({ response });
    return response;
  } catch (error) {
    return error;
  }
};

export const registerUser = async (user) => {
  try {
    const response = await api.post(`/api/v1/admin/register`, user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const validateOtpToVerifiedRegister = async (email, otp_code) => {
  try {
    const data = {
      email: email,
      otp: otp_code,
    };
    const response = await api.post(`/api/v1/admin/verified-otp`, data);
    return response;
  } catch (error) {
    return error;
  }
};

// Password reset functions
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post(
      `/api/v1/admin/forgot-password`,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const verifyPasswordResetOtp = async (email, otp_code) => {
  try {
    const data = {
      email: email,
      otp: otp_code,
    };
    const response = await api.post(`/api/v1/admin/verify-reset-otp`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email, otp_code, newPassword) => {
  try {
    const data = {
      email: email,
      otp: otp_code,
      password: newPassword,
    };
    const response = await api.post(`/api/v1/admin/reset-password`, data);
    return response;
  } catch (error) {
    throw error;
  }
};
