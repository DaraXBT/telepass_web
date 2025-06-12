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
