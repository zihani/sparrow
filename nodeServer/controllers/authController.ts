import { Context } from 'koa'
import jsonwebtoken from 'jsonwebtoken'
import { secret } from '../middleware/jwt'
import { mockUsers } from '../models/user'
import { request, summary, tags, body, responses } from 'koa-swagger-decorator'

export default class AuthController {
  @request('post', '/api/public/login')
  @summary('用户登录')
  @tags(['public'])
  @body({ username: { type: 'string', required: true }, password: { type: 'string', required: true } })
  @responses({ 200: { description: '登录成功，返回JWT' } })
  public async login(ctx: Context) {
    const { username, password } = (ctx.request.body as { username?: string; password?: string }) || {}
    if (!username) {
      ctx.status = 401
      ctx.body = { code: -1, message: '用户名或密码错误' }
      return
    }
    const user = mockUsers[username]
    if (user && user.password === password) {
      const token = jsonwebtoken.sign(
        {
          id: username,
          role: user.role,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        secret
      )
      ctx.body = { code: 0, message: '登录成功', data: { token } }
    } else {
      ctx.status = 401
      ctx.body = { code: -1, message: '用户名或密码错误' }
    }
  }
}