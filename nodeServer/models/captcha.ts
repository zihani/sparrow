export type CaptchaRecord = { code: string; expiresAt: number }
// 简单内存存储（生产可替换为 Redis 等带过期能力的存储）
export const captchaStore = new Map<string, CaptchaRecord>()
