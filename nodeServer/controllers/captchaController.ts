import { Context } from 'koa'
import { request, summary, tags, responses } from 'koa-swagger-decorator'
import { CaptchaService } from '../services/captchaService'

export default class CaptchaController {
  @request('get', '/api/public/captcha')
  @summary('获取登录验证码')
  @tags(['public'])
  @responses({ 200: { description: '返回验证码图片与ID' } })
  public async get(ctx: Context) {
    // 控制器仅负责响应封装，生成逻辑在业务层
    const { id, image } = CaptchaService.get()
    ctx.body = { code: 0, message: 'ok', data: { captchaId: id, image } }
  }
}
