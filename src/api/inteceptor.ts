import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession } from "next-auth/react";

export const API_URL = process.env.apiUrl;

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
    return Promise.reject("missing access token");
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

async function responseErrorInterceptor({ status, code, ...err }: AxiosError) {
  const isNotWorkError = code == "ERR_NETWORK";
  if (isNotWorkError) {
    try {
      //
      window.location.pathname = "/error";
    } catch {}
  }
  return Promise.reject({ ...err, status, code });
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
export default ihttp;
