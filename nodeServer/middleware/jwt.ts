import jwt from 'koa-jwt'

export const secret = process.env.JWT_SECRET ?? 'YOUR_SUPER_SECRET_KEY'

const unlessPath = [/^\/api\/public\/login/, /^\/api\/public\/captcha/, /^\/swagger-html/, /^\/swagger-json/]

// 鉴权中间件：保护除白名单之外的所有接口
export const auth = (jwt({ secret }) as any).unless({ path: unlessPath })
