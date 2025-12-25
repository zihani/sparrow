import { captchaStore } from '../models/captcha'

// 验证码业务逻辑：
// - 生成验证码（默认 2 分钟有效）
// - 校验验证码（一次性使用）

export class CaptchaService {
  /**
   * 生成新的验证码并返回图片与 ID
   */
  static get() {
    const id = CaptchaService.randId()
    const code = CaptchaService.randCode()
    captchaStore.set(id, { code, expiresAt: Date.now() + 2 * 60 * 1000 })
    return { id, image: CaptchaService.svgFor(code) }
  }
  /**
   * 校验验证码，正确且未过期返回 true；并清理使用过的验证码
   */
  static check(id: string, code: string) {
    const rec = captchaStore.get(id)
    if (!rec) return false
    const ok = Date.now() <= rec.expiresAt && rec.code.toUpperCase() === code?.toUpperCase()
    captchaStore.delete(id)
    return ok
  }
  private static randId() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36)
  }
  private static randCode(length = 5) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let s = ''
    for (let i = 0; i < length; i++) s += chars[Math.floor(Math.random() * chars.length)]
    return s
  }
  private static svgFor(code: string) {
    const w = 120
    const h = 40
    const noise = Array.from({ length: 4 })
      .map(
        () =>
          `<line x1="${Math.random() * w}" y1="${Math.random() * h}" x2="${Math.random() * w}" y2="${Math.random() * h}" stroke="#${Math.floor(
            Math.random() * 0xffffff
          )
            .toString(16)
            .padStart(6, '0')}" stroke-width="1"/>`
      )
      .join('')
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <rect width="100%" height="100%" fill="#f5f5f5"/>
  ${noise}
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="22" fill="#333">${code}</text>
</svg>`
    const b64 = Buffer.from(svg, 'utf8').toString('base64')
    return `data:image/svg+xml;base64,${b64}`
  }
}
