export type UserRecord = { password: string; role: string }
// 模拟用户存储（实际项目应替换为数据库）
export const mockUsers: Record<string, UserRecord> = {
  user1: { password: 'password1', role: 'admin' },
  user2: { password: 'password2', role: 'guest' },
}
