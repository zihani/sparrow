import { Context } from 'koa'
import jsonwebtoken from 'jsonwebtoken'
import { secret } from '../middleware/jwt'
import { mockUsers } from '../models/user'
import { request, summary, tags, body, responses } from 'koa-swagger-decorator'
import { AuthService } from '../services/authService'

export default class AuthController {
  @request('post', '/api/public/login')
  @summary('用户登录')
  @tags(['public'])
  @body({
    username: { type: 'string', required: true },
    password: { type: 'string', required: true },
    captchaId: { type: 'string', required: true },
    captchaCode: { type: 'string', required: true },
  })
  @responses({ 200: { description: '登录成功，返回JWT' } })
  public async login(ctx: Context) {
    console.log(ctx.request.body)
    // 委托认证到业务层，控制器仅做入参转发与统一出参
    const result = await AuthService.login(ctx.request.body as any)
    ctx.status = result.status
    ctx.body = result.body
  }
}
