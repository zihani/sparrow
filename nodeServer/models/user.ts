export type UserRecord = { password: string; role: string }

export const mockUsers: Record<string, UserRecord> = {
  user1: { password: 'password1', role: 'admin' },
  user2: { password: 'password2', role: 'guest' },
}