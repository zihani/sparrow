import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

let defaultConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const http: AxiosInstance = axios.create(defaultConfig);

http.interceptors.request.use((config) => config);
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      const { useUserStore } = await import('@/stores/useUserStore');
      const { default: pinia } = await import('@/stores/index');
      const store = useUserStore(pinia);
      store.logout();
      const { default: router } = await import('@/router');
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

const attach401Redirect = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const status = error?.response?.status;
      if (status === 401) {
        const { useUserStore } = await import('@/stores/useUserStore');
        const { default: pinia } = await import('@/stores/index');
        const store = useUserStore(pinia);
        store.logout();
        const { default: router } = await import('@/router');
        router.push('/login');
      }
      return Promise.reject(error);
    }
  );
};

const setAxiosConfig = (config: AxiosRequestConfig) => {
  defaultConfig = { ...defaultConfig, ...config };
  Object.assign(http.defaults, defaultConfig);
};

const setHeader = (name: string, value: string | null) => {
  const headersAny = http.defaults.headers as unknown as Record<string, any>;
  if (value === null) {
    if (headersAny.common) {
      delete headersAny.common[name];
    }
    delete headersAny[name];
  } else {
    if (headersAny.common) {
      headersAny.common[name] = value;
    } else {
      headersAny[name] = value;
    }
  }
};

const requestWithConfig = <T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  return http.request<T>(config);
};

interface LoginPayload {
  username: string;
  password: string;
}

const login = (payload: LoginPayload): Promise<AxiosResponse<any>> => {
  return requestWithConfig({
    method: 'POST',
    url: '/api/public/login',
    data: payload,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const getCaptcha = (): Promise<AxiosResponse<{ data: { image: string; captchaId: string } }>> => {
  return requestWithConfig<{ data: { image: string; captchaId: string } }>({
    method: 'GET',
    url: '/api/public/captcha',
  });
};

// 固定 IP 的 axios.create 通用工厂
const FIXED_IP_BASE = import.meta.env.VITE_API_BASE;
interface CreateClientOptions {
  basePath?: string;
  timeout?: number;
  headers?: Record<string, string>;
  token?: string;
}
const createFixedIPClient = (options?: CreateClientOptions): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${FIXED_IP_BASE}${options?.basePath ?? ''}`,
    timeout: options?.timeout ?? 10000,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });
  if (options?.token) {
    (instance.defaults.headers as any).common = {
      ...(instance.defaults.headers as any).common,
      Authorization: `Bearer ${options.token}`,
    };
  }
  attach401Redirect(instance);
  return instance;
};

export { http, setAxiosConfig, setHeader, requestWithConfig, login, getCaptcha, createFixedIPClient, attach401Redirect };
