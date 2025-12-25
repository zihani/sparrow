import jsonwebtoken from 'jsonwebtoken'
import { mockUsers } from '../models/user'
import { secret } from '../middleware/jwt'
import { CaptchaService } from './captchaService'

// 认证业务逻辑：
// - 校验用户名/密码
// - 校验验证码
// - 生成并返回 JWT

export class AuthService {
  /**
   * 登录流程的业务入口
   * @param params 请求参数（包含账号、密码与验证码）
   * @returns 统一的状态码与响应体
   */
  static async login(params: { username?: string; password?: string; captchaId?: string; captchaCode?: string }) {
    const { username, password, captchaId, captchaCode } = params
    if (!username || !password) {
      return { status: 401, body: { code: -1, message: '用户名或密码错误' } }
    }
    if (!captchaId || !captchaCode || !CaptchaService.check(captchaId, captchaCode)) {
      return { status: 400, body: { code: -3, message: '验证码错误或过期' } }
    }
    const user = mockUsers[username]
    if (!user || user.password !== password) {
      return { status: 401, body: { code: -1, message: '用户名或密码错误' } }
    }
    const expiresInEnv = process.env.JWT_EXPIRES_IN
    const expiresIn = expiresInEnv ? Number(expiresInEnv) : 3600
    const token = jsonwebtoken.sign({ id: username, role: user.role }, secret, { expiresIn })
    return { status: 200, body: { code: 0, message: '登录成功', data: { token, user: { id: username, role: user.role } } } }
  }
}
