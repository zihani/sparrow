import { Context } from 'koa'
import { request, summary, tags, responses } from 'koa-swagger-decorator'
import { SecureService } from '../services/secureService'

export default class SecureController {
  @request('get', '/api/secure/list')
  @summary('获取受保护的列表')
  @tags(['secure'])
  @responses({ 200: { description: '列表返回成功' }, 403: { description: '权限不足' } })
  public async list(ctx: Context) {
    // 将权限判断与数据获取下沉到业务层
    const result = SecureService.getList(ctx.state.user)
    ctx.status = result.status
    ctx.body = result.body
  }
}
