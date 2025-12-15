// 请求配置的结构
interface RequestConfig {
  params: { key: string, value: string }[];
  authorization: { type: 'None' | 'Bearer Token', token: string };
  headers: { key: string, value: string }[];
  body: { type: 'none' | 'raw' | 'form-data', content: string };
}

// 响应结果的结构 (简化)
interface ApiResponse {
  status: number;
  time: number; // ms
  headers: Record<string, string>;
  data: any;
}
export type { RequestConfig, ApiResponse };