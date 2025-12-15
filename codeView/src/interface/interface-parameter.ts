interface DynamicParams {
  id: string | number; // 可能是字符串或数字的用户/资源 ID
  type?: 'A' | 'B' | 'C'; // 可选参数，限定为特定字符串
  limit?: number; // 可选的数字限制
  searchQuery: string; // 必填的搜索查询
}
export type { DynamicParams };