import { mockList } from '../models/item'

// 权限业务逻辑：
// - 根据用户角色返回列表或提示权限不足

export class SecureService {
  /**
   * 获取受保护列表
   * @param user 从 JWT 中间件注入的用户信息
   */
  static getList(user: any) {
    if (user?.role === 'admin' || user?.role === 'guest') {
      return { status: 200, body: { code: 0, message: '获取列表成功', data: { items: mockList, userRole: user.role } } }
    }
    return { status: 403, body: { code: -2, message: '权限不足' } }
  }
}
