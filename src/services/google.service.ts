import {api} from "@/api/inteceptor";

// Maximum number of retry attempts for API calls
const MAX_RETRIES = 3;
// Base delay in milliseconds before retrying (will be multiplied by attempt number)
const RETRY_DELAY = 1000;

interface GoogleAuthData {
  googleId: string;
  email: string;
  name: string;
  image?: string;
}

interface GoogleUserProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  [key: string]: any;
}

interface GoogleAdminResponse {
  username: string;
  email: string;
  fullName: string;
  profileImage: string;
  googleId: string;
  isGoogleAccount: boolean;
  token: string;
  accessToken: string;
  message: string;
}

/**
 * Check if admin exists with Google credentials
 * @param googleData Google user data
 * @returns Response indicating if admin exists
 */
export const checkGoogleAdmin = async (googleData: GoogleAuthData) => {
  try {
    console.log("Checking if Google admin exists:", googleData.email);

    const response = await withRetry(() =>
      api.post(`/api/v1/admin/check-google-account`, {
        googleId: googleData.googleId,
        email: googleData.email,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      })
    );

    console.log("Google admin check response:", response);
    return response;
  } catch (error: any) {
    console.error("Google admin check error:", error);
    return error.response || error;
  }
};

/**
 * Register a new Google admin
 * @param googleData Google user data
 * @returns Response from registration
 */
export const registerGoogleAdmin = async (googleData: GoogleAuthData) => {
  try {
    console.log("Registering Google admin:", googleData.email);

    // Generate a secure random password for Google accounts
    const securePassword =
      Math.random().toString(36).slice(-10) +
      Math.random().toString(36).toUpperCase().slice(-2) +
      "!#" + Math.random().toString(10).slice(-2);

    // Create username from email
    const username = googleData.email.split("@")[0] || `google_${googleData.googleId}`;

    const adminData = {
      username: username,
      googleId: googleData.googleId,
      email: googleData.email,
      fullName: googleData.name,
      profileImage: googleData.image || "",
      password: securePassword,
      isGoogleAccount: true,
    };

    const response = await withRetry(() =>
      api.post(`/api/v1/admin/register`, adminData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
    );

    console.log("Google admin registration response:", response);
    return response;
  } catch (error: any) {
    console.error("Google admin registration error:", error);
    return error.response || error;
  }
};

/**
 * Complete Google OAuth authentication flow
 * Checks for existing admin first, registers if needed
 * @param googleData User data from Google OAuth
 * @returns Authentication response with token
 */
export const authenticateWithGoogle = async (googleData: GoogleAuthData): Promise<any> => {
  try {
    console.log("Starting Google authentication for:", googleData.email);

    // First check if admin exists
    const checkResponse = await checkGoogleAdmin(googleData);
    
    if (checkResponse.status === 200 && checkResponse.data?.payload) {
      // Admin exists, return login data
      console.log("Existing Google admin found");
      return {
        status: 200,
        data: {
          ...checkResponse.data.payload,
          message: checkResponse.data.message || "Login successful",
        }
      };
    }

    // Admin doesn't exist, register new one
    console.log("Google admin not found, registering new admin");
    const registerResponse = await registerGoogleAdmin(googleData);

    if (registerResponse.status === 200 && registerResponse.data?.payload) {
      console.log("Google admin registered successfully");
      return {
        status: 200,
        data: {
          ...registerResponse.data.payload,
          message: registerResponse.data.message || "Registration successful",
        }
      };
    }

    throw new Error("Failed to authenticate with Google");
  } catch (error: any) {
    console.error("Google authentication error:", error);
    throw error;
  }
};

/**
 * Get user profile data using Google's APIs
 * @param accessToken Google access token
 * @returns User profile data
 */
export const fetchGoogleUserData = async (
  accessToken: string
): Promise<GoogleUserProfile> => {
  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Google user data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Google user data:", error);
    throw error;
  }
};

/**
 * Transform Google user profile to our expected format
 * @param profile Google user profile
 * @returns Formatted Google auth data
 */
export const transformGoogleProfile = (profile: GoogleUserProfile): GoogleAuthData => {
  return {
    googleId: profile.id,
    email: profile.email,
    name: profile.name || profile.given_name || profile.email.split('@')[0],
    image: profile.picture || "",
  };
};

/**
 * Helper function to implement retry logic for API calls
 * @param operation Function to retry
 * @param maxRetries Maximum number of retry attempts
 * @returns Result of the operation
 */
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;

      // Don't retry on authentication errors (401), client errors (4xx), or if this is the last attempt
      if (
        error.response?.status === 401 || 
        (error.response?.status >= 400 && error.response?.status < 500) ||
        attempt === maxRetries
      ) {
        throw error;
      }

      // Exponential backoff with jitter
      const delay = RETRY_DELAY * attempt * (0.8 + Math.random() * 0.4);
      console.log(`Retry attempt ${attempt}/${maxRetries} after ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
