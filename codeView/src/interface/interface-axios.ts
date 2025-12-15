// 定义API响应的数据结构（假设返回数据有一个data字段是数组）
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T[];
}
export type { ApiResponse };