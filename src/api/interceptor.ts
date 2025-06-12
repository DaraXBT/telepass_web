import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import {getSession, signIn} from "next-auth/react";

export const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

// Token refresh state to prevent duplicate refresh attempts
let isRefreshing = false;
let failedQueue: Array<{resolve: Function; reject: Function}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({resolve, reject}) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Without Token
export const api_stream = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "TEXT_EVENT_STREAM_VALUE",
  },
});

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// With Token
const ihttp = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

async function requestInterceptor(config: InternalAxiosRequestConfig) {
  const idToken: any = await getSession();
  console.log("idToken :", idToken);
  if (!idToken) {
    console.error("No session token found - request will be rejected");
    return Promise.reject({
      message: "missing access token",
      status: 401,
      code: "UNAUTHENTICATED",
    });
  }
  if (!idToken.token) {
    console.error("Session found but no token property:", idToken);
    return Promise.reject({
      message: "missing access token in session",
      status: 401,
      code: "UNAUTHENTICATED",
    });
  }

  // Check if token is expired
  try {
    const tokenPayload = JSON.parse(atob(idToken.token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    if (tokenPayload.exp && tokenPayload.exp < currentTime) {
      console.error(
        "JWT token is expired. Expiry:",
        new Date(tokenPayload.exp * 1000)
      );
      return Promise.reject({
        message: "JWT token expired",
        status: 401,
        code: "TOKEN_EXPIRED",
      });
    }
  } catch (e) {
    console.warn("Could not parse JWT token for expiry check:", e);
  }

  config.headers["Authorization"] = `Bearer ${idToken?.token}`;
  config.headers["Content-Type"] = "application/json";
  return config;
}
async function requestInterceptorFormData(config: InternalAxiosRequestConfig) {
  const idToken: any = await getSession();
  if (!idToken) {
    return Promise.reject("missing access token");
  }
  config.headers["Authorization"] = `Bearer ${idToken?.token}`;
  config.headers["Content-Type"] = "multipart/form-data";
  return config;
}

async function responseInterceptor(value: AxiosResponse<any, any>) {
  return value;
}

async function responseErrorInterceptor(error: AxiosError) {
  const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean;
  };
  const {status, code} = error;

  // Handle network errors
  const isNotWorkError = code == "ERR_NETWORK";
  if (isNotWorkError) {
    try {
      window.location.pathname = "/error";
    } catch {}
    return Promise.reject({...error, status, code});
  }

  // Handle 401 unauthorized errors - token refresh
  if (status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      // If refresh is already in progress, queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({resolve, reject});
      })
        .then(() => {
          // Retry the original request after token refresh
          return ihttp(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Attempt to refresh the token by calling signIn
      await signIn("credentials", {redirect: false});

      // Get the new session
      const newSession = await getSession();
      if (newSession?.token) {
        // Update authorization header
        originalRequest.headers["Authorization"] = `Bearer ${newSession.token}`;

        // Process queued requests
        processQueue(null, newSession.token);

        // Retry original request
        return ihttp(originalRequest);
      } else {
        throw new Error("No token in refreshed session");
      }
    } catch (refreshError) {
      // Refresh failed, process queue with error and redirect to login
      processQueue(refreshError, null);
      window.location.href = "/";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject({...error, status, code});
}

ihttp.interceptors.request.use(requestInterceptor);
ihttp.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

export const ihttpFormData = axios.create({
  baseURL: API_URL,
});
ihttpFormData.interceptors.request.use(requestInterceptorFormData);
ihttpFormData.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
);

export {ihttp};
export default ihttp;
