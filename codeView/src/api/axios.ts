import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { RequestConfig, ApiResponse } from '../interface/interface-apiPost';
import type { DynamicParams } from '../interface/interface-parameter';
// 创建axios实例

/**
 * 发送一个带有动态参数的GET请求
 * @param url 请求的URL
 * @param params 动态的查询参数对象
 * @returns Promise<AxiosResponse<ApiResponse<any>>>
 */
const fetchDataWithDynamicParams = <T>(
  url: string,
  params: DynamicParams
): Promise<AxiosResponse<ApiResponse<T>>> => {
  // AxiosRequestConfig 用于配置请求，params 会被自动序列化为查询字符串 (?id=...&type=...)
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: url,
    params: params, // 核心：将类型安全的 DynamicParams 对象赋给 config.params
  };

  // 返回 axios 实例的 Promise
  return axios.request<ApiResponse<T>>(config);
};

const sendPostRequest = (
  url: string,
  payload: DynamicParams // 现在这个对象是请求体 (body)
): Promise<AxiosResponse<any>> => {
  const config: AxiosRequestConfig = {
    method: 'POST',
    url: url,
    data: payload, // 核心：POST/PUT/PATCH 使用 data 字段
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios.request(config);
};
export { fetchDataWithDynamicParams , sendPostRequest};
