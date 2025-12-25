// 请求配置的结构
interface UrlEncodedRow {
  key: string;
  value: string;
  description: string;
}

interface FormDataRow extends UrlEncodedRow {
  type: 'text' | 'file';
  fileName?: string;
}

interface BinaryContent {
  fileName: string;
  file?: File;
}

type AuthType =
  | 'None'
  | 'Basic Auth'
  | 'Bearer Token'
  | 'JWT Bearer'
  | 'Digest Auth'
  | 'OAuth 1.0'
  | 'OAuth 2.0'
  | 'Hawk Authentication'
  | 'AWS Signature'
  | 'NTLM Authentication'
  | 'API Key'
  | 'Akamai EdgeGrid'
  | 'ASAP (AtIassian)';

interface RequestConfig {
  params: { key: string, value: string, description: string }[];
  authorization: { type: AuthType, token: string };
  headers: { key: string, value: string, description: string }[];
  body: { type: 'form-data' | 'x-www-form-urlencoded' | 'raw' | 'binary' | 'none', content: string | UrlEncodedRow[] | FormDataRow[] | BinaryContent };
}

// 响应结果的结构 (简化)
interface ApiResponse {
  status: number;
  time: number; // ms
  headers: Record<string, string>;
  data: any;
}
export type { RequestConfig, ApiResponse, UrlEncodedRow, FormDataRow, BinaryContent, AuthType };
