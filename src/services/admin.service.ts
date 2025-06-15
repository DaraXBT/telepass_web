import { api } from "@/api/interceptor";

interface ChangePasswordWithTokenRequest {
  token: string;
  newPassword: string;
}

interface ChangePasswordWithTokenResponse {
  success: boolean;
  message: string;
}

export const changePasswordWithToken = async (
  reqBody: ChangePasswordWithTokenRequest
): Promise<ChangePasswordWithTokenResponse> => {
  try {
    const response = await api.post(
      `/api/v1/admin/change-password-with-token`,
      reqBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );
    
    console.log("Change password response:", response);
    return {
      success: true,
      message: response.data?.message || "Password changed successfully",
    };
  } catch (error: any) {
    console.error("Change password error:", error);
    
    // Handle different error scenarios
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      "Failed to change password";
    
    return {
      success: false,
      message: errorMessage,
    };
  }
};

// Additional admin service functions can be added here
export const adminService = {
  changePasswordWithToken,
};
