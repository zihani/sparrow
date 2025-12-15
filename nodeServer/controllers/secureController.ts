import { Context } from 'koa'
import { mockList } from '../models/item'
import { request, summary, tags, responses } from 'koa-swagger-decorator'

export default class SecureController {
  @request('get', '/api/secure/list')
  @summary('获取受保护的列表')
  @tags(['secure'])
  @responses({ 200: { description: '列表返回成功' }, 403: { description: '权限不足' } })
  public async list(ctx: Context) {
    const user = ctx.state.user
    if (user.role === 'admin' || user.role === 'guest') {
      ctx.body = { code: 0, message: '获取列表成功', data: { items: mockList, userRole: user.role } }
    } else {
      ctx.status = 403
      ctx.body = { code: -2, message: '权限不足' }
    }
  }
}